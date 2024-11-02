"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";

import { prisma } from "@/prisma";

export async function renameCoverLetter(name: string, coverId: string) {
  try {
    // Retrieve the authenticated user session
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
    const updatedCoverLetter = await prisma.coverletter.updateMany({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
      data: {
        coverName: name,
      },
    });

    if (updatedCoverLetter.count === 0) {
      throw new Error(
        "Resume not found or you're not authorized to update this resume."
      );
    }

    return { message: "Cover letter renamed successfully", updatedCoverLetter };
  } catch (error) {
    console.error("Error renaming cover letter:", error);
    throw new Error("Failed to rename cover letter. Please try again later.");
  } finally {
    await prisma.$disconnect();
  }
}
