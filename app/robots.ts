import { MetadataRoute } from "next";
import { prisma } from "@/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const posts = await prisma.blog.findMany();
  const postsEditIgnores = posts.map(({ slug }) => `/blogs/edit/${slug}`);
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/blogs/edit", ...postsEditIgnores],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}

