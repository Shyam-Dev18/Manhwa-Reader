import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/mongodb";
import Manhwa from "@/models/Manhwa";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim().toLowerCase();

  if (!slug) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  await dbConnect();

  const existing = await Manhwa.findOne({ slug })
    .select({ slug: 1, _id: 0 })
    .lean<{ slug: string } | null>();

  return NextResponse.json({ available: !existing });
}
