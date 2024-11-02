"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";

export async function createBlogPost(
  title: string,
  slug: string,
  excerpt: string | null,
  content: string,
  category: string,
  author: string,
  thumbnail: string,
  published: boolean,
  tags: string[], // Corrected this line
  isFeatured: boolean
) {
  try {
    const session = await auth();
    
    let ip = headers().get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    console.log(ip, "ip address")
    const ratelimit = rateLimiter(session?.user?.id, ip)
    console.log(ratelimit);
    if (ratelimit) {
      console.log("rate limit exceeded")
      return { message: "Rate limit exceeded.", status: 429 };
    }

    // Ensure user is authenticated
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    // Create blog post entry in Prisma
    const blogPost = await prisma.blog.create({
      data: {
        title: title.toString(),
        slug: slug.toString(),
        excerpt: excerpt ? excerpt.toString() : null,
        content: content.toString(),
        category: category.toString(),
        author: author.toString(),
        thumbnail: thumbnail,
        published: published,
        tags: tags, // Correctly passing the string array
        spark: 0,
        views: 0,
        isFeatured: isFeatured,
      },
    });

    return {
      success: true,
      message: "Blog post created successfully",
      blogPost,
    };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return {
      success: false,
      message: "Failed to create blog post",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await prisma.$disconnect();
  }
}
