"use server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function createCover(coverName: string) {
  try {
    const session = await auth();
    let ip = headers().get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    console.log(ip, "ip address");
    const ratelimit = rateLimiter(session?.user?.id, ip);
    console.log(ratelimit);
    if (ratelimit) {
      console.log("rate limit exceeded");
      return { message: "Rate limit exceeded.", status: 429 };
    }
    console.log("Hello", coverName);

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

    console.log(cover);
   revalidatePath("/home", "page");
    return {
      success: true,
      message: "Resume created successfully",
      cover,
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    throw error;
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
