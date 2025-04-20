"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import axios from "axios";

export const deleteAccount = asyncHandler(async () => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  
  await prisma.user.delete({
    where: {
      id: session?.user?.id,
    },
  });

  return {
    success: true,
    message: "Your account has been deleted successfully.",
    status: 200,
  };
});
