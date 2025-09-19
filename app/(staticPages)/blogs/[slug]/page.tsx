import BlogPost from "@/components/blogs/blogPost";
import { Metadata } from "next";
import { prisma } from "@/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import { load } from "cheerio"; // Update import
import Breadcrumb from "@/components/Breadcrumb";

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany();
  return posts.map(({ slug }) => slug).slice(0, 10);
}

const fetchBlog = cache(async (slug: string) => {
  const id = slug.split("-");
  //console.log(id);

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: id[id.length - 1] },
    });
    return blog;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await fetchBlog(params.slug);
  if (!data) return { title: "Blog Post Not Found" };
  const baseUrl = "https://resumetweaker.vercel.app";
  const thumbnailUrl = data.thumbnail || "No blog image";
  const publishedDate = data.createdAt?.toISOString();
  const updatedDate = data.updatedAt?.toISOString();
  const postUrl = `${baseUrl}/blogs/${params.slug}`;
  
  // Extract clean tags for better SEO
  const cleanTags = data.tags?.map(tag => tag.trim()) || [];
  
  return {
    title: `${data.title} | ResumeTweaker Blog`,
    description: data.excerpt || `Read ${data.title} - Learn about resume building, job interviews, and career advice on ResumeTweaker.`,
    keywords: [...cleanTags, 'resume tips', 'career advice', 'job search', 'interview preparation'],
    openGraph: {
      type: "article",
      url: postUrl,
      title: data.title,
      description: data.excerpt ?? undefined,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      siteName: "ResumeTweaker",
      publishedTime: publishedDate,
      modifiedTime: updatedDate,
      authors: [data.author || 'ResumeTweaker Team'],
      tags: cleanTags,
    },

    twitter: {
      card: "summary_large_image",
      title: data.title,
      images: [thumbnailUrl],
      description: data.excerpt ?? undefined,
      site: "@wibblitofficial"
    },

    other: {
      "article:author": data.author || "ResumeTweaker Team",
      "article:section": data.category || "Career Advice",
      "article:tag": cleanTags.join(", "),
      "article:published_time": publishedDate,
      "article:modified_time": updatedDate,
    },
    alternates: {
      canonical: `${baseUrl}/blogs/${params.slug}`,
    },
    
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  //console.log("params", params.slug);
  let data = await fetchBlog(params.slug);
  if (!data) return notFound();

  const HTMLcontent = await fetch(data.content);
  data.content = await HTMLcontent.text();
  const tableOfContents = extractH2Content(data.content);
  const newData = { ...data, tableOfContents };
  
  // Create Article schema                                                                                                                                                                                                                                                
  const baseUrl = "https://resumetweaker.vercel.app";
  const articleSchema = {
    '@context': 'https://schema.org',                                                                                                                                                                                                                                             
    '@type': 'Article',
    'headline': data.title,
    'description': data.excerpt || '',
    'image': data.thumbnail || '',
    'author': {
      '@type': 'Person',
      'name': data.author || 'ResumeTweaker Team'
    },
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://resumetweaker.vercel.app/#organization',
      'name': 'ResumeTweaker',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://resumetweaker.vercel.app/favicons/apple-touch-icon.png'
      }
    },
    'datePublished': data.createdAt?.toISOString() || new Date().toISOString(),
    'dateModified': data.updatedAt?.toISOString() || new Date().toISOString(),
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${params.slug}`
    }
  };
  
  //console.log(tableOfContents);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: data.title, href: `/blogs/${params.slug}`, active: true }
        ]} />
      </div>
      <BlogPost data={newData!} />
    </>
  );
}

function extractH2Content(htmlStr: string) {
  const $ = load(htmlStr);

  let h2Content = $("h2")
    .map((_, h2) => {
      let text = $(h2).text();
      return text.replace(/^\d+\.\s*/, "").trim();
    })
    .get();

  return h2Content;
}
