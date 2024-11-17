"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteCoverLetter(coverId: string) {
  console.log("reached delete");
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
    await prisma.coverletter.deleteMany({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
    });
       revalidatePath("/home", "page");
    return { success: true, message: "Successfully deleted the cover letter" };
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    throw new Error("Error deleting the cover letter");
  } finally {
    await prisma.$disconnect();
  }
}
