import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Manhwa from "@/models/Manhwa";
import Chapter from "@/models/Chapter";
import { adminManhwaWriteSchema } from "@/lib/validators/manhwa";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
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

  const parsed = adminManhwaWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  const existingManhwa = await Manhwa.findOne({ slug })
    .select({ publicationStatus: 1, slug: 1, _id: 0 })
    .lean<{ publicationStatus?: "draft" | "published"; slug: string } | null>();

  if (!existingManhwa) {
    return NextResponse.json({ error: "Manhwa not found" }, { status: 404 });
  }

  if (
    existingManhwa.publicationStatus === "published" &&
    parsed.data.publicationStatus === "draft"
  ) {
    return NextResponse.json(
      { error: "Published manhwa cannot be moved back to draft" },
      { status: 400 }
    );
  }

  try {
    const updated = await Manhwa.findOneAndUpdate(
      { slug },
      {
        title: parsed.data.title,
        slug: parsed.data.slug,
        coverImage: parsed.data.coverImage,
        synopsis: parsed.data.synopsis,
        genres: parsed.data.genres,
        rating: parsed.data.rating,
        publicationStatus: parsed.data.publicationStatus,
        status: parsed.data.status,
      },
      { new: true }
    )
      .select({ slug: 1, _id: 0 })
      .lean<{ slug: string } | null>();

    if (!updated) {
      return NextResponse.json({ error: "Manhwa not found" }, { status: 404 });
    }

    if (parsed.data.slug !== slug) {
      await Chapter.updateMany({ manhwaSlug: slug }, { manhwaSlug: parsed.data.slug });
    }

    return NextResponse.json({ slug: updated.slug });
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

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await params;

  await dbConnect();

  await Chapter.deleteMany({ manhwaSlug: slug });

  const deleted = await Manhwa.findOneAndDelete({ slug })
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string } | null>();

  if (!deleted) {
    return NextResponse.json({ error: "Manhwa not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
