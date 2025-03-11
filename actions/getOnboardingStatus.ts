"use server";
import { prisma } from "@/prisma";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { auth } from "@/auth";

export const getOnboardingStatus = asyncHandler(async () => {
  const session = await auth();
  const status = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { isOnboarded: true },
  });
  return {
    success: true,
    message: "onBoard status fetche successfully",
      status: 200,
      onBoardStatus: status?.isOnboarded,
  };
});
