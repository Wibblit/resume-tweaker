"use server";

import { auth } from "@/auth";
import { CoverLetterData, CoverLetterState } from "@/types/types";
import { ResumeStyles as CoverStyle } from "@/types/types";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";

export async function savecoverData(
  coverData: CoverLetterData,
  coverStyles: CoverStyle,
  coverId: string
) {
  const session = await auth();
  console.log("Save data request reached...");
  console.log(coverData);

  try {
    let ip = headers().get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    console.log(ip, "ip address");
    const ratelimit = rateLimiter(session?.user?.id, ip);

    console.log(ratelimit);
    if (ratelimit) {
      console.log("rate limit exceeded");
      return { message: "Rate limit exceeded.", status: 429 };
    }
    const result = await prisma.coverletter.update({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
      data: {
        salutation: coverData.salutation,
        closing: coverData.closing,
        culturalFit: coverData.culturalFit,
        date: coverData.date,
        interestInPosition: coverData.interestInPosition,
        keyAchievements: coverData.keyAchievements,
        opening: coverData.opening,
        professionalSummary: coverData.professionalSummary,
        senderInfo : coverData.senderInfo ,
        recipientInfo: coverData.recipientInfo,
        signOff: coverData.signOff,
        subject: coverData.subject,
        styles: JSON.parse(JSON.stringify(coverStyles)),
      },
    });

    return {
      success: true,
      result: result,
      message: "Cover Letter updated successfully",
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: "Failed to update resume details",
      error: errorMessage,
    };
  } finally {
    await prisma.$disconnect();
  }
}
