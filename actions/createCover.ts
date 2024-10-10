"use server";
import { auth } from "@/auth";

import { prisma } from "@/prisma";

export async function createCover(coverName: string) {
  try {
    const session = await auth();
    console.log("Hello", coverName)
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }  
      
    const cover = await prisma.coverletter.create({
      data: {
        userId: session.user.id.toString(),
        coverName: coverName.toString(),
      },
    });
      
      console.log(cover)

    return {
      success: true,
      message: "Resume created successfully",
      cover,
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    throw error
    // if (error instanceof Error) {
    //   errorMessage = error.message;
    // }

    // return {
    //   success: false,
    //   message: "Failed to create resume",
    //   error: errorMessage,
    // };
  } finally {
    await prisma.$disconnect();
  }
}
