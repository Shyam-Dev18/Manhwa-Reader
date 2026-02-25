import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Manhwa from "@/models/Manhwa";
import {
  adminChapterWriteSchema,
  sortImagesAscending,
} from "@/lib/validators/chapter";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = adminChapterWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  const manhwaExists = await Manhwa.findOne({ slug })
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string } | null>();

  if (!manhwaExists) {
    return NextResponse.json({ error: "Manhwa not found" }, { status: 404 });
  }

  try {
    const created = await Chapter.create({
      manhwaSlug: slug,
      chapterNumber: parsed.data.chapterNumber,
      title: parsed.data.title || undefined,
      slug: parsed.data.slug,
      images: sortImagesAscending(parsed.data.images),
    });

    await Manhwa.findOneAndUpdate(
      { slug },
      {
        $max: { latestChapterNumber: parsed.data.chapterNumber },
        $inc: { totalChapters: 1 },
      }
    );

    return NextResponse.json({ slug: created.slug }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      const duplicateError = error as { keyPattern?: { slug?: number } };
      if (duplicateError.keyPattern?.slug) {
        return NextResponse.json({ error: "Chapter slug already exists" }, { status: 409 });
      }
      return NextResponse.json(
        { error: "Chapter number already exists for this manhwa" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
