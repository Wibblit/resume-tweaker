"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { deleteFileFromR2 } from "@/utils/delete";

export const deleteJD = asyncHandler(async (jobId: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!jobId) throw ActionsError.badRequest;

  // const { r2FileName } = await prisma.jD.delete({
  //   where: {
  //     id: jobId,
  //     userId: session?.user?.id,
  //   },
  //   select: {
  //     r2FileName: true,
  //   },
  // });

  // //delete the JD from r2 using jdUrl
  // const response = await deleteFileFromR2({
  //   bucketName: process.env.R2_BUCKET_JDS!,
  //   fileName: r2FileName,
  // });

  await prisma.jD.update({
    where: {
      id: jobId,
      userId: session.user.id,
    },
    data: {
      isDeleted: true,
    },
  });

  // console.log("response from r2 jd deletion", JSON.stringify(response));

  return {
    success: true,
    message: "Successfully deleted the job description",
    status: 200,
  };
});
