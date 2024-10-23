// app/api/get-blog/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const id = slug.split('-')
  console.log(id)

  try {
    const blog = await prisma.blog.findUnique({
      where: { id : id[id.length-1] },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
