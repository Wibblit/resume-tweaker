"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function renameResume(name: string, resumeId: string) {
    try {
        // Retrieve the authenticated user session
        const session = await auth();
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

        return { message: "Resume renamed successfully", updatedResume };
    } catch (error) {
        console.error("Error renaming resume:", error);
        throw new Error("Failed to rename resume. Please try again later.");
    } finally {
        await prisma.$disconnect()
    }
}
