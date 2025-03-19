"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import r2Storage from "@/utils/upload";

export const updateBlogPost = asyncHandler(async (formData: FormData) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw ActionsError.userNotAuthenticated;

    // Log incoming data for debugging
    //console.log("Received form data:", Object.fromEntries(formData.entries()));

    // Extract and validate all required fields
    const id = formData.get("id");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const category = formData.get("category");
    const author = formData.get("author");
    const published = formData.get("published");
    const isFeatured = formData.get("isFeatured");
    const isImgChanged = formData.get("isImgChanged");
    const thumbnailType = formData.get("thumbnailType");
    const tags = formData.get("tags");

    if (!id || !title || !slug || !content || !category || !author) {
      console.error("Missing required fields:", {
        id,
        title,
        slug,
        content,
        category,
        author,
      });
      throw ActionsError.badRequest;
    }

    let thumbnailUrl;

    if (thumbnailType === "file" && isImgChanged === "true") {
      const file = formData.get("thumbnail");
      if (file) {
        thumbnailUrl = await r2Storage.uploadFile({
          //@ts-ignore
          file,
          bucketName: process.env.R2_BUCKET_BLOGS as string,
        });
      }
    } else {
      thumbnailUrl = formData.get("thumbnail") as string;
    }

    if (!thumbnailUrl) {
      throw new Error("Thumbnail URL is required");
    }

    // Upload content to R2
    const contentUrl = await r2Storage.uploadHtml(slug as string, content as string);

    // Parse values
    const parsedTags = JSON.parse(tags as string) as string[];
    const parsedPublished = published === "true";
    const parsedIsFeatured = isFeatured === "true";

    // Update blog post
    const updatedBlogPost = await prisma.blog.update({
      where: { id: id as string },
      data: {
        title: title as string,
        slug: slug as string,
        excerpt: (formData.get("excerpt") as string) || null,
        content: contentUrl,
        category: category as string,
        author: author as string,
        thumbnail: thumbnailUrl,
        published: parsedPublished,
        tags: parsedTags,
        isFeatured: parsedIsFeatured,
      },
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
      status: 200,
    };
  } catch (error) {
    console.error("Server error:", error);
    throw error;
  }
});
