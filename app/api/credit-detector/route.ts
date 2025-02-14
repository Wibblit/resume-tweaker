import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { creditList } from "@/utils/credits";

export const PATCH = asyncHandler(async (req: NextRequest) => {
  const session = await auth();
  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (!session || !session.user?.id) throw ApiError.userNotAuthenticated;

  if (rateLimiter(session?.user?.id, ip)) throw ApiError.rateLimitExceeded;
  const { type } = await req.json();

  //console.log(type, "This is the type");
  if (type === "resumeslot") {
    const data = await prisma.userAssets.update({
      where: {
        userId: session?.user?.id,
      },
      data: {
        credits: {
          decrement: creditList.get("resumeslot"),
        },
        resumeslot: {
          increment: 1,
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Resume slot purchased successfully.",
      data: data,
    });
  }

  if (type === "coverslot") {
    const data = await prisma.userAssets.update({
      where: {
        userId: session?.user?.id,
      },
      data: {
        credits: {
          decrement: creditList.get("coverslot"),
        },
        coverslot: {
          increment: 1,
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Cover letter slot purchased successfully.",
      data: data,
    });
  }
});
