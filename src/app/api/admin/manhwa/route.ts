import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Manhwa from "@/models/Manhwa";
import { adminManhwaWriteSchema } from "@/lib/validators/manhwa";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = adminManhwaWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const created = await Manhwa.create({
      title: parsed.data.title,
      slug: parsed.data.slug,
      coverImage: parsed.data.coverImage,
      synopsis: parsed.data.synopsis,
      genres: parsed.data.genres,
      rating: parsed.data.rating,
      publicationStatus: parsed.data.publicationStatus,
      status: parsed.data.status,
      alternativeTitles: [],
      authors: [],
      artists: [],
      studio: "",
      releaseYear: 0,
      totalChapters: 0,
      latestChapterNumber: 0,
    });

    return NextResponse.json({ slug: created.slug }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
