// app/api/get-blog/[slug]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // const session = await auth();
  const { slug } = params;

  const id = slug.split("-");
  //console.log(id)

  // let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  // ip = ip === "::1" ? "127.0.0.1" : ip;
  try {
    // if (rateLimiter(session?.user?.id, ip)) {
    //   return NextResponse.json(
    //     { message: "Rate limit exceeded." },
    //     { status: 429 }
    //   );
    // }

    const blog = await prisma.blog.findUnique({
      where: { id: id[id.length - 1] },
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
  } finally {
    await prisma.$disconnect();
  }
}
