"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function updateBlogPost(
  id: string,
  title: string,
  slug: string,
  excerpt: string | null,
  content: string,
  category: string,
  author: string,
  thumbnail: string,
  published: boolean,
  tags: string[],
  isFeatured : boolean
) {
  try {
    const session = await auth();

    // Ensure user is authenticated
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    // Update blog post entry in Prisma
    const updatedBlogPost = await prisma.blog.update({
      where: { id: id },
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
        isFeatured : isFeatured
        // Note: We're not updating spark and views here as they should be managed separately
      },
    });

    console.log("Blog post updated:", updatedBlogPost);
    revalidatePath('/', "layout")
    return {
      success: true,
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return {
      success: false,
      message: "Failed to update blog post",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await prisma.$disconnect();
  }
}
