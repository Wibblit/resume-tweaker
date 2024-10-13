
import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        isFeatured: true, // Fetch only featured blogs
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
