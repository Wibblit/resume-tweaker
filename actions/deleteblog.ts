"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function deleteBlog(slug: string) {
  console.log("reached delete");
  const session = await auth();
  try {
    await prisma.blog.deleteMany({
      where: {
        slug: slug,
      },
    });
    return { success: true, message: "Successfully deleted the resume" };
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Error deleting the resume");
  } finally {
    await prisma.$disconnect();
  }
}
