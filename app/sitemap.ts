import { MetadataRoute } from "next";
import { prisma } from "@/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blog.findMany();
  const postEntries: MetadataRoute.Sitemap = posts.map(
    ({ slug, updatedAt }) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${slug}`,
      lastModified: updatedAt,
      // changeFrequency,
      // priority
    })
  );
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
    },
    ...postEntries,
  ];
}
