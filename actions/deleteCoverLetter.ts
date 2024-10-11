"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function deleteCoverLetter(coverId: string) {
  console.log("reached delete");
  const session = await auth();
  try {
    await prisma.coverletter.deleteMany({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
    });
    return { success: true, message: "Successfully deleted the cover letter" };
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    throw new Error("Error deleting the cover letter");
  } finally {
    await prisma.$disconnect();
  }
}
