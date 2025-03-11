import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { auth, unstable_update } from "@/auth";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session) throw ApiError.userNotAuthenticated;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    throw ApiError.custom("Missing code parameter", 400);
  }
  console.log("Authorization code: ", code);
  const response = await axios.post(
    "http://localhost:3001/api/auth/gmail/token",
    { code, session }
  );
console.log("Response Data", response.data)
  if (response.status === 200) {
    const updatedSession =  await unstable_update({
      ...session,
      user: {
        ...session.user,
        connectedEmail: response.data.data.email,
      },
    });
    console.log("Session Email Auth", updatedSession)
  }

  if (response.status !== 200) {
    throw ApiError.custom("Failed to authenticate with Gmail", 500);
  }
  // Redirect to the profile page after successful authentication
  return NextResponse.redirect(
    new URL(
      `/job-tracker?gmailConnected=true&email=${response.data.data.email}`,
      req.nextUrl.origin
    )
  );
});
