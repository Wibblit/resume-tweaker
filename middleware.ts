import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "./lib/rateLimiter";

export default auth(async function middleware(req: NextRequest) {
  let session;

  try {
    const sessionRes = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    console.log("Session fetch response status:", sessionRes.status);

    if (!sessionRes.ok) {
      const errorText = await sessionRes.text();
      console.error("Failed to fetch session:", sessionRes.status, errorText);
      return NextResponse.next(); 
    }

    session = await sessionRes.json();
  } catch (error) {
    console.error("Error fetching or parsing session:", error);
    return NextResponse.next(); 
  }

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (
    req.nextUrl.pathname === "/rate-limit-error" ||
    req.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  if (session) {
      if (rateLimiter(session?.user?.id, ip)) {
        console.log("Rate limit hit")
      return NextResponse.redirect(new URL("/rate-limit-error", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
