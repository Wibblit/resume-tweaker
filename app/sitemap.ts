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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/privacy-policy`
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/cookie-policy`
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/terms-of-service`
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/refund-policy`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/interview`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/review`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/builder`
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`
    },
    ...postEntries,
  ];
}
