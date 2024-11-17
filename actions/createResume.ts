"use server"
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function createResume(resumeName: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
 let ip = headers().get("x-forwarded-for") || "127.0.0.1";
 ip = ip === "::1" ? "127.0.0.1" : ip;
 console.log(ip, "ip address");
 const ratelimit = rateLimiter(session?.user?.id, ip);

 console.log(ratelimit);
 if (ratelimit) {
   console.log("rate limit exceeded");
   return { message: "Rate limit exceeded.", status: 429 };
 }
    

    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        resumeName: resumeName,
      },
    });

    revalidatePath('/home', "page")

    return {
      success: true,
      message: "Resume created successfully",
      resume,
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: "Failed to create resume",
      error: errorMessage,
    };
  } finally {
    await prisma.$disconnect();
  }
}