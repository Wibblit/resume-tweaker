"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
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
  tags: string[],
  isFeatured: boolean
) {
  try {
    const session = await auth();
    const ip = headers().get("x-forwarded-for");
    console.log(ip, "this is ip")
    // Ensure user is authenticated
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

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
        tags: tags, 
        spark: 0,
        views: 0,
        isFeatured: isFeatured,
      },
    });

    const finalSlug = `${slug}-${blogPost.id}`;
    
    const updatedBlogPost = await prisma.blog.update({
      where: { id: blogPost.id },
      data: { slug: finalSlug },
    });

    // Revalidate cache
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Blog post created successfully",
      blogPost: updatedBlogPost,
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
