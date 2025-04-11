import { MetadataRoute } from "next";
import { prisma } from "@/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Fetch all blog posts
  const posts = await prisma.blog.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });
  
  // Map blog posts to sitemap entries with appropriate priority
  const postEntries: MetadataRoute.Sitemap = posts.map(
    ({ slug, updatedAt }, index) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${slug}`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: index < 5 ? 0.8 : 0.6 // Higher priority for recent posts
    })
  );
  
  // Define main static pages with appropriate priorities
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0 // Homepage gets highest priority
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9 // High priority for pricing page
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9 // Blog index is important for SEO
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/interview`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/review`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/builder`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    // Legal pages - lower priority but still important
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5
    }, 
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/legal/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5
    },
    ...postEntries,
  ];
}
