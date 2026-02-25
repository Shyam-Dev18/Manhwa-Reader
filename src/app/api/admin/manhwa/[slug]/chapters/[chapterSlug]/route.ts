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
  params: Promise<{ slug: string; chapterSlug: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug, chapterSlug } = await params;

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

  const existing = await Chapter.findOne({ manhwaSlug: slug, slug: chapterSlug })
    .select({ slug: 1, chapterNumber: 1, _id: 0 })
    .lean<{ slug: string; chapterNumber: number } | null>();

  if (!existing) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  if (parsed.data.chapterNumber !== existing.chapterNumber) {
    const numberTaken = await Chapter.findOne({
      manhwaSlug: slug,
      chapterNumber: parsed.data.chapterNumber,
    })
      .select({ slug: 1, _id: 0 })
      .lean<{ slug: string } | null>();

    if (numberTaken) {
      return NextResponse.json(
        { error: "Chapter number already exists for this manhwa" },
        { status: 409 }
      );
    }
  }

  if (parsed.data.slug !== chapterSlug) {
    const slugTaken = await Chapter.findOne({ slug: parsed.data.slug })
      .select({ slug: 1, _id: 0 })
      .lean<{ slug: string } | null>();

    if (slugTaken) {
      return NextResponse.json({ error: "Chapter slug already exists" }, { status: 409 });
    }
  }

  const updated = await Chapter.findOneAndUpdate(
    { manhwaSlug: slug, slug: chapterSlug },
    {
      chapterNumber: parsed.data.chapterNumber,
      title: parsed.data.title || undefined,
      slug: parsed.data.slug,
      images: sortImagesAscending(parsed.data.images),
    },
    { new: true }
  )
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string } | null>();

  if (!updated) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const [latestChapter] = await Promise.all([
    Chapter.find({ manhwaSlug: slug })
      .sort({ chapterNumber: -1 })
      .limit(1)
      .select({ chapterNumber: 1, _id: 0 })
      .lean<{ chapterNumber: number }[]>(),
  ]);

  await Manhwa.findOneAndUpdate(
    { slug },
    {
      latestChapterNumber: latestChapter[0]?.chapterNumber ?? 0,
    }
  );

  return NextResponse.json({ slug: updated.slug });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug, chapterSlug } = await params;

  await dbConnect();

  const deleted = await Chapter.findOneAndDelete({ manhwaSlug: slug, slug: chapterSlug })
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string } | null>();

  if (!deleted) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const [latestChapterNumber, totalChapters] = await Promise.all([
    Chapter.find({ manhwaSlug: slug })
      .sort({ chapterNumber: -1 })
      .limit(1)
      .select({ chapterNumber: 1, _id: 0 })
      .lean<{ chapterNumber: number }[]>(),
    Chapter.countDocuments({ manhwaSlug: slug }),
  ]);

  await Manhwa.findOneAndUpdate(
    { slug },
    {
      latestChapterNumber: latestChapterNumber[0]?.chapterNumber ?? 0,
      totalChapters,
    }
  );

  return NextResponse.json({ success: true });
}
