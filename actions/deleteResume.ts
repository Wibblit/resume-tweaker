"use server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";

export async function deleteResume(resumeId: string) {
    console.log("reached delete")
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
  try {
    await prisma.resume.deleteMany({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
    });
    return { success: true, message: "Successfully deleted the resume" }
  } catch (error) {
      console.error("Error deleting resume:", error);
      throw new Error("Error deleting the resume");
  } finally {
      await prisma.$disconnect();
  }
}
