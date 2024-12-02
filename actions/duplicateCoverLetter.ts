"use server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function duplicateCoverLetter(coverId: string) {
  const session = await auth();

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

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const originalCoverLetter = await prisma.coverletter.findFirst({
      where: {
        id: coverId,
        userId: session.user.id,
      },
    });

    if (!originalCoverLetter) {
      throw new Error(
        "Cover letter not found or you're not authorized to duplicate this cover letter."
      );
    }

    const parsedStyles = JSON.parse(JSON.stringify(originalCoverLetter.styles));

    const duplicatedCoverLetter = await prisma.coverletter.create({
      data: {
        userId: originalCoverLetter.userId,
        coverName: `${originalCoverLetter.coverName} (Copy)`,
        closing: originalCoverLetter.closing,
        culturalFit: originalCoverLetter.culturalFit,
        date: originalCoverLetter.date,
        interestInPosition: originalCoverLetter.interestInPosition,
        keyAchievements: originalCoverLetter.keyAchievements,
        opening: originalCoverLetter.opening,
        professionalSummary: originalCoverLetter.professionalSummary,
        recipientInfo: originalCoverLetter.recipientInfo,
        salutation: originalCoverLetter.salutation,
        senderInfo : originalCoverLetter.senderInfo,
        signOff: originalCoverLetter.signOff,
        subject: originalCoverLetter.subject,
        styles: parsedStyles,
      },
    });
   revalidatePath("/home", "page");
    return { message: "Cover Letter duplicated successfully", duplicatedCoverLetter };
  } catch (error) {
    console.error("Error duplicating cover letter:", error);
    throw new Error("Failed to duplicate cover letter. Please try again later.");
  } finally {
    await prisma.$disconnect();
  }
}
