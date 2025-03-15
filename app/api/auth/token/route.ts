import { getToken } from "next-auth/jwt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { auth } from "@/auth";
import JWT from "jsonwebtoken";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session) throw ApiError.userNotAuthenticated;

  const token = JWT.sign(
    { user: session.user },
    process.env.AUTH_SECRET as string,
    { expiresIn: "1h" }
  );

  if (!token) throw ApiError.custom("Unable to get JWT token", 400);

  return NextResponse.json({ token });
});
