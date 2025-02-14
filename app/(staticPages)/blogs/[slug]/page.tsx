import BlogPost from "@/components/blogs/blogPost";
import { Metadata } from "next";
import { prisma } from "@/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import { load } from "cheerio"; // Update import

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

  const thumbnailUrl = data.thumbnail || "No blog image";

  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      images: [
        {
          url: thumbnailUrl,
        },
      ],
    },
    keywords: data.tags,
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
  //console.log(tableOfContents);
  return <BlogPost data={newData!} />;
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
