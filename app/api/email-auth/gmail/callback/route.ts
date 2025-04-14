import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { auth } from "@/auth";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session) throw ApiError.userNotAuthenticated;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    throw ApiError.custom("Missing code parameter", 400);
  }

  const cookieHeader = req.headers.get("cookie");
  const notificationServiceBaseUrl = (
    process.env.NOTIFICATION_SERVICE_BASE_URL || ""
  ).toString();

  console.log("Authorization code: ", code);
  const response = await axios.post(
    notificationServiceBaseUrl + "/api/auth/gmail/token",
    { code, session },
    {
      withCredentials: true,
      headers: {
        Cookie: cookieHeader || "",
      },
    }
  );
  console.log("Response Data", response.data);

  if (response.status !== 200) {
    throw ApiError.custom("Failed to authenticate with Gmail", 500);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  // Redirect to the profile page after successful authentication
  return NextResponse.redirect(
    new URL(
      `/home/job-tracker?gmailConnected=true&email=${response.data.data.email}`,
      baseUrl
    )
  );
});
