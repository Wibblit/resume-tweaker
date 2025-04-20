// Create a new file: app/api/disconnectGmail/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { auth } from "@/auth";

export const POST = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session) throw ApiError.userNotAuthenticated;

  const cookieHeader = req.headers.get("cookie");
  const notificationServiceBaseUrl = (
    process.env.NOTIFICATION_SERVICE_BASE_URL || ""
  ).toString();

  const response = await axios.post(
    notificationServiceBaseUrl + "/api/auth/gmail/halt-email-watch",
    {
      userId: session.user.id,
    },
    {
      withCredentials: true,
      headers: {
        Cookie: cookieHeader || "",
      },
    }
  );

  if (response.status !== 200) {
    throw ApiError.custom("Failed to disconnect Gmail", 500);
  }

  return NextResponse.json({ success: true });
});
