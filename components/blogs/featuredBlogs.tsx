// import Image from "next/image"
// import Link from "next/link"
// import { featuredBlogs } from "@/data/BlogsData"
// import { Badge } from "../ui/badge"
// import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react"

// export default function BentoGrid() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
//           Featured Blogs
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {featuredBlogs.map((blog, index) => (
//           <Link
//             key={index}
//             href={`blogs/${blog.id}`}
//             className={`group relative overflow-hidden rounded-xl ${
//               index === 0
//                 ? "md:col-span-2 md:row-span-2"
//                 : index === featuredBlogs.length - 1
//                 ? "md:col-span-2"
//                 : ""
//             }`}
//           >
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 transition-opacity group-hover:opacity-80" />
//             <Image
//               src={blog.image}
//               alt={blog.title}
//               width={800}
//               height={600}
//               className="h-full w-full object-cover transition-transform group-hover:scale-105"
//             />
//             <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/20 via-transparent to-transparent">
//               <Badge className="w-fit mb-3">
//                 {blog.category}
//               </Badge>
//               <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{blog.title}</h3>
//               <p className="text-sm md:text-lg text-gray-200 mb-4">{blog.excerpt}</p>
//               <div className="flex items-center text-xs md:text-base text-gray-300 space-x-4">
//                 <span className="flex items-center">
//                   <CalendarIcon className="w-4 h-4 mr-1" />
//                   {blog.date}
//                 </span>
//                 <span className="flex items-center">
//                   <ClockIcon className="w-4 h-4 mr-1" />
//                   {blog.readTime}
//                 </span>
//               </div>
//             </div>
//             <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
//               <ArrowRightIcon className="w-4 h-4 text-white" />
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: string[];
  spark: number;
  views: number;
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const imageReadTime = 12; // seconds per image

  // Count words
  const wordCount = content.split(/\s+/).length;

  // Count base64 images
  const base64Count = (content.match(/data:image\/[^;]+;base64,/g) || [])
    .length;

  // Calculate total read time in minutes
  const textReadTimeMinutes = wordCount / wordsPerMinute;
  const imageReadTimeMinutes = (base64Count * imageReadTime) / 60;
  const totalReadTimeMinutes = Math.ceil(
    textReadTimeMinutes + imageReadTimeMinutes
  );

  return `${totalReadTimeMinutes} min read`;
}

export default function BentoGrid() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("/api/get-blogs");
      const data: Blog[] = await response.json();
      setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Featured Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.length > 0 && (
          <div className="md:col-span-2 md:row-span-2">
            <BlogCard blog={blogs[0]} isLarge={true} />
          </div>
        )}
        <div className="space-y-6">
          {blogs.slice(1, 3).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
        {blogs.length > 3 && (
          <div className="md:col-span-3">
            <BlogCard blog={blogs[3]} isWide={true} />
          </div>
        )}
      </div>
    </div>
  );
}

interface BlogCardProps {
  blog: Blog;
  isLarge?: boolean;
  isWide?: boolean;
}

function BlogCard({ blog, isLarge = false, isWide = false }: BlogCardProps) {
  const readTime = calculateReadTime(blog.content);

  return (
    <Link
      href={`blogs/${blog.slug}`}
      className={`group relative overflow-hidden rounded-xl block ${
        isLarge ? "h-full" : isWide ? "h-64" : "h-64"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 transition-opacity group-hover:opacity-80" />
      <Image
        src={blog.thumbnail}
        alt={blog.title}
        width={800}
        height={600}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <Badge className="w-fit mb-3">{blog.category}</Badge>
        <h3
          className={`font-bold text-white mb-2 ${
            isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          {blog.title}
        </h3>
        <p
          className={`text-gray-200 mb-4 ${
            isLarge ? "text-lg" : "text-sm"
          } line-clamp-2`}
        >
          {blog.excerpt}
        </p>
        <div className="flex items-center text-gray-300 space-x-4 text-sm">
          <span className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {readTime}
          </span>
        </div>
      </div>
      <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowRightIcon className="w-4 h-4 text-white" />
      </div>
    </Link>
  );
}