import EditBlogPost from "../EditBlog";
import { prisma } from "@/prisma";

export default async function BlogEditPage({
  params,
}: {
  params: { slug: string };
}) {
  let blog = await prisma.blog.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (blog) {
    const HTMLcontent = await fetch(blog.content);
    blog.content = await HTMLcontent.text();
  } else {
    blog = {
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: "",
      thumbnail: "",
      author: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
      tags: [""],
      spark: 0,
      views: 0,
      isFeatured: false,
    };
  }

  return <EditBlogPost blog={blog!} />;
}
