"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";

export const updateBlogPost = asyncHandler(
  async (
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
    isFeatured: boolean,
  ) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (
      !id ||
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !category ||
      !author ||
      !thumbnail ||
      !published ||
      !tags ||
      !isFeatured
    )
      throw ActionsError.badRequest;

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
        isFeatured: isFeatured,
        // Note: We're not updating spark and views here as they should be managed separately
      },
    });
    return {
      success: true,
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    };
  },
);
