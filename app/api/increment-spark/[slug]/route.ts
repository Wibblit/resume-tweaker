// import { NextResponse } from "next/server";
// import { prisma } from "@/prisma";
// import { auth } from "@/auth";
// import { rateLimiter } from "@/lib/rateLimiter";
// import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
// import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

// export async function POST(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;
//   const session = await auth();
//   const userId = session?.user?.id;
//   const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
//     ","
//   )[0];

//   if (rateLimiter(userId, ip)) {
//     return NextResponse.json({ status: 429, message: "Rate limit exceeded" });
//   }

//   try {
//     // Find the blog post by slug and increment the spark value by 1
//     const updatedBlog = await prisma.blog.update({
//       where: { slug },
//       data: {
//         spark: {
//           increment: 1, // This will increase spark by 1
//         },
//       },
//     });

//     return NextResponse.json({ success: true, updatedBlog });
//   } catch (error) {
//     console.error("Error updating spark:", error);
//     return NextResponse.json(
//       { success: false, message: "Error updating spark" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

export const POST = asyncHandler(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const { slug } = params;
    const session = await auth();
    const userId = session?.user?.id;
    const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];

    if (rateLimiter(userId, ip)) {
      throw ApiError.rateLimitExceeded; // Use the rate-limiting error
    }

    // Find the blog post by slug and increment the spark value by 1
    const updatedBlog = await prisma.blog.update({
      where: { slug },
      data: {
        spark: {
          increment: 1, // This will increase spark by 1
        },
      },
    });

    return NextResponse.json({ success: true, updatedBlog });
  }
);
