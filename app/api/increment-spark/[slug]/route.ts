import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // Find the blog post by slug and increment the spark value by 1
    const updatedBlog = await prisma.blog.update({
      where: { slug },
      data: {
        spark: {
          increment: 1, // This will increase spark by 1
        },
      },
    });

    return NextResponse.json({ success: true, updatedBlog });
  } catch (error) {
    console.error("Error updating spark:", error);
    return NextResponse.json(
      { success: false, message: "Error updating spark" },
      { status: 500 }
    );
  }
}
