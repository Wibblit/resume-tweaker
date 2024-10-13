// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// interface Blog {
//   id: string;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   category: string;
//   author: string;
//   thumbnail: string;
//   createdAt: string;
//   updatedAt: string;
//   published: boolean;
//   tags: string[];
//   spark: number;
//   views: number;
// }

// function calculateReadTime(content: string): string {
//   const wordsPerMinute = 200;
//   const imageReadTime = 12; // seconds per image

//   // Count words
//   const wordCount = content.split(/\s+/).length;

//   // Count base64 images
//   const base64Count = (content.match(/data:image\/[^;]+;base64,/g) || [])
//     .length;

//   // Calculate total read time in minutes
//   const textReadTimeMinutes = wordCount / wordsPerMinute;
//   const imageReadTimeMinutes = (base64Count * imageReadTime) / 60;
//   const totalReadTimeMinutes = Math.ceil(
//     textReadTimeMinutes + imageReadTimeMinutes
//   );

//   return `${totalReadTimeMinutes} min read`;
// }

// export default function BentoGrid() {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("/api/get-featured-blogs");
//         const data: Blog[] = await response.json();
//         setBlogs(data);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
//         Featured Blogs
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {isLoading ? (
//           <>
//             <div className="md:col-span-2 md:row-span-2">
//               <SkeletonBlogCard isLarge />
//             </div>
//             <div className="space-y-6">
//               <SkeletonBlogCard />
//               <SkeletonBlogCard />
//             </div>
//             <div className="md:col-span-3">
//               <SkeletonBlogCard isWide />
//             </div>
//           </>
//         ) : (
//           <>
//             {blogs.length === 0 ? (
//               <div>
//                 <h1>No Blogs Yet</h1>
//               </div>
//             ) : (
//               <>
//                 {blogs.length > 0 && (
//                   <div className="md:col-span-2 md:row-span-2">
//                     <BlogCard blog={blogs[0]} isLarge={true} />
//                   </div>
//                 )}
//                 <div className="space-y-6">
//                   {blogs.slice(1, 3).map((blog) => (
//                     <BlogCard key={blog.id} blog={blog} />
//                   ))}
//                 </div>
//                 {blogs.length > 3 && (
//                   <div className="md:col-span-3">
//                     <BlogCard blog={blogs[3]} isWide={true} />
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// interface BlogCardProps {
//   blog: Blog;
//   isLarge?: boolean;
//   isWide?: boolean;
// }

// function BlogCard({ blog, isLarge = false, isWide = false }: BlogCardProps) {
//   const readTime = calculateReadTime(blog.content);

//   return (
//     <Link
//       href={`blogs/${blog.slug}`}
//       className={`group relative overflow-hidden rounded-xl block ${
//         isLarge ? "h-full" : isWide ? "h-64" : "h-64"
//       }`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 transition-opacity group-hover:opacity-80" />
//       <Image
//         src={blog.thumbnail}
//         alt={blog.title}
//         width={800}
//         height={600}
//         className="h-full w-full object-cover transition-transform group-hover:scale-105"
//       />
//       <div className="absolute inset-0 flex flex-col justify-end p-6">
//         <Badge className="w-fit mb-3">{blog.category}</Badge>
//         <h3
//           className={`font-bold text-white mb-2 ${
//             isLarge ? "text-2xl" : "text-xl"
//           }`}
//         >
//           {blog.title}
//         </h3>
//         <p
//           className={`text-gray-200 mb-4 ${
//             isLarge ? "text-lg" : "text-sm"
//           } line-clamp-2`}
//         >
//           {blog.excerpt}
//         </p>
//         <div className="flex items-center text-gray-300 space-x-4 text-sm">
//           <span className="flex items-center">
//             <CalendarIcon className="w-4 h-4 mr-1" />
//             {new Date(blog.createdAt).toLocaleDateString()}
//           </span>
//           <span className="flex items-center">
//             <ClockIcon className="w-4 h-4 mr-1" />
//             {readTime}
//           </span>
//         </div>
//       </div>
//       <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
//         <ArrowRightIcon className="w-4 h-4 text-white" />
//       </div>
//     </Link>
//   );
// }

// interface SkeletonBlogCardProps {
//   isLarge?: boolean;
//   isWide?: boolean;
// }

// function SkeletonBlogCard({
//   isLarge = false,
//   isWide = false,
// }: SkeletonBlogCardProps) {
//   return (
//     <div
//       className={`relative overflow-hidden rounded-xl ${
//         isLarge ? "h-full" : isWide ? "h-64" : "h-64"
//       }`}
//     >
//       <Skeleton className="h-full w-full" />
//       <div className="absolute inset-0 flex flex-col justify-end p-6">
//         <Skeleton className="w-20 h-6 mb-3" />
//         <Skeleton className={`h-8 w-3/4 mb-2 ${isLarge ? "h-10" : ""}`} />
//         <Skeleton className="h-4 w-full mb-4" />
//         <Skeleton className="h-4 w-full mb-2" />
//         <div className="flex items-center space-x-4">
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-24" />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/get-featured-blogs");
        const data = await response.json();
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          throw new Error("Received invalid data format");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
          Featured Blogs
        </h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Featured Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <div className="md:col-span-2 md:row-span-2">
              <SkeletonBlogCard isLarge />
            </div>
            <div className="space-y-6">
              <SkeletonBlogCard />
              <SkeletonBlogCard />
            </div>
            <div className="md:col-span-3">
              <SkeletonBlogCard isWide />
            </div>
          </>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold">No Blogs Yet</h2>
                <p>Check back later for featured blog posts.</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </>
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

interface SkeletonBlogCardProps {
  isLarge?: boolean;
  isWide?: boolean;
}

function SkeletonBlogCard({
  isLarge = false,
  isWide = false,
}: SkeletonBlogCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${
        isLarge ? "h-full" : isWide ? "h-64" : "h-64"
      }`}
    >
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <Skeleton className="w-20 h-6 mb-3" />
        <Skeleton className={`h-8 w-3/4 mb-2 ${isLarge ? "h-10" : ""}`} />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}