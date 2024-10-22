import BlogPost from "@/components/blogs/blogPost";
import { Metadata } from "next";
import { prisma } from "@/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Session } from "next-auth";

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany();
  return posts.map(({ slug }) => slug).slice(0, 10);
}

const fetchBlog = cache(async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });
  return blog;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await fetchBlog(params.slug);
  if (!data) return { title: "Blog Post Not Found" };
  return {
    title: data?.title,
    description: data?.excerpt,
    openGraph: {
      images: [
        {
          url: data?.thumbnail! || "No blog image",
        },
      ],
    },
  };
}

async function getSession(): Promise<Session | null> {
  const res = await fetch("/api/auth/session");
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data as Session;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const [session, data] = await Promise.all([
    getSession(),
    fetchBlog(params.slug)
  ]);

  if (!data) return notFound();

  return <BlogPost session={session} data={data} />;
}