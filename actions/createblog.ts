"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

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
  isFeatured : boolean
) {
  try {
    const session = await auth();
    console.log(title);
    console.log(slug);
    console.log(excerpt);
    console.log(category);
    console.log(author);
    console.log(thumbnail), console.log(published);
    console.log(tags);
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
        isFeatured : isFeatured
      },
    });

    console.log("Blog post created:", blogPost);

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
