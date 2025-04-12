"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { uploadFileToR2, uploadHtmlToR2 } from "@/utils/upload";

export async function createBlogPost(formData: FormData) {
  try {
    const session = await auth();
    const ip = headers().get("x-forwarded-for");
    //console.log(ip, "this is ip");
    // Ensure user is authenticated
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const author = formData.get("author") as string;
    const published = formData.get("published") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const tags = JSON.parse(formData.get("tags") as string) as string[];

    const image = formData.get("image") as File;

    const contentUrl = await uploadHtmlToR2(slug, content);

    const thumbnailURL = await uploadFileToR2({
      file: image,
      bucketName: process.env.R2_BUCKET_BLOGS as string,
    });

    const blogPost = await prisma.blog.create({
      data: {
        title: title.toString(),
        slug: slug.toString(),
        excerpt: excerpt ? excerpt.toString() : null,
        content: contentUrl,
        category: category.toString(),
        author: author.toString(),
        thumbnail: thumbnailURL,
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
