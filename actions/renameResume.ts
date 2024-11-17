"use server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function renameResume(name: string, resumeId: string) {
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
        const updatedResume = await prisma.resume.updateMany({
            where: {
                id: resumeId,
                userId: session?.user?.id,
            },
            data: {
                resumeName: name,
            },
        });

        if (updatedResume.count === 0) {
            throw new Error("Resume not found or you're not authorized to update this resume.");
        }
   revalidatePath("/home", "page");
        return { message: "Resume renamed successfully", updatedResume };
    } catch (error) {
        console.error("Error renaming resume:", error);
        throw new Error("Failed to rename resume. Please try again later.");
    } finally {
        await prisma.$disconnect()
    }
}
