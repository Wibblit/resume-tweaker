// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowUpRight, Calendar, Clock } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
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

//   const wordCount = content.split(/\s+/).length;
//   const base64Count = (content.match(/data:image\/[^;]+;base64,/g) || [])
//     .length;

//   const textReadTimeMinutes = wordCount / wordsPerMinute;
//   const imageReadTimeMinutes = (base64Count * imageReadTime) / 60;
//   const totalReadTimeMinutes = Math.ceil(
//     textReadTimeMinutes + imageReadTimeMinutes
//   );

//   return `${totalReadTimeMinutes} min read`;
// }

// export default function LatestBlogs() {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("/api/get-blogs");
//         const data: Blog[] = await response.json();
//         //console.log(data)
//         setBlogs(data ? data : []);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   return (
//     <section className="py-12 md:py-24">
//       <div className="container px-4 md:px-6">
//         <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl mb-8">
//           Latest Blogs
//         </h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//           {isLoading
//             ? Array(6)
//               .fill(0)
//               .map((_, index) => <SkeletonBlogCard key={index} />)
//             : blogs.length === 0 ? <div className="md:col-span-3">
//               <h2 className="text-xl font-semibold">No Blogs Yet</h2>
//               <p>Check back later for latest blog posts.</p>
//             </div> : blogs.map((blog) => (
//               <Link
//                 href={`blogs/${blog.slug}`}
//                 key={blog.id}
//                 className="group"
//               >
//                 <Card className="cursor-pointer h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
//                   <CardHeader className="p-0">
//                     <div className="overflow-hidden">
//                       <Image
//                         src={blog.thumbnail}
//                         alt={blog.title}
//                         width={800}
//                         height={400}
//                         className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
//                       />
//                     </div>
//                   </CardHeader>
//                   <CardContent className="flex flex-col gap-4 p-6 flex-grow">
//                     <Badge className="w-fit">{blog.category}</Badge>
//                     <CardTitle className="text-xl md:text-2xl line-clamp-2">
//                       {blog.title}
//                     </CardTitle>
//                     <CardDescription className="line-clamp-4 leading-5">
//                       {blog.excerpt}
//                     </CardDescription>
//                   </CardContent>
//                   <CardFooter className="flex items-center justify-between p-6 mt-auto">
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <Calendar className="mr-2 h-4 w-4" />
//                       {new Date(blog.createdAt).toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <Clock className="mr-2 h-4 w-4" />
//                       {calculateReadTime(blog.content)}
//                     </div>
//                   </CardFooter>
//                   <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
//                     <ArrowUpRight className="h-4 w-4 text-white" />
//                   </div>
//                 </Card>
//               </Link>
//             ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function SkeletonBlogCard() {
//   return (
//     <Card className="cursor-pointer h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
//       <CardHeader className="p-0">
//         <Skeleton className="w-full h-48 rounded-t-lg" />
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4 p-6 flex-grow">
//         <Skeleton className="w-20 h-6" />
//         <Skeleton className="w-full h-8" />
//         <Skeleton className="w-full h-4" />
//         <Skeleton className="w-full h-4" />
//         <Skeleton className="w-3/4 h-4" />
//       </CardContent>
//       <CardFooter className="flex items-center justify-between p-6 mt-auto">
//         <Skeleton className="w-24 h-4" />
//         <Skeleton className="w-24 h-4" />
//       </CardFooter>
//     </Card>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const wordCount = content.split(/\s+/).length;
  const base64Count = (content.match(/data:image\/[^;]+;base64,/g) || [])
    .length;

  const textReadTimeMinutes = wordCount / wordsPerMinute;
  const imageReadTimeMinutes = (base64Count * imageReadTime) / 60;
  const totalReadTimeMinutes = Math.ceil(
    textReadTimeMinutes + imageReadTimeMinutes
  );

  return `${totalReadTimeMinutes} min read`;
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/get-blogs");
        const data: Blog[] = await response.json();
        //console.log(data)
        setBlogs(data ? data : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl mb-8">
          Latest Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, index) => <SkeletonBlogCard key={index} />)
          ) : blogs.length === 0 ? (
            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold">No Blogs Yet</h2>
              <p>Check back later for latest blog posts.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <Link href={`blogs/${blog.slug}`} key={blog.id} className="group">
                <Card className="cursor-pointer h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                  <CardHeader className="p-0">
                    <div className="overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        width={800}
                        height={400}
                        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 p-6 flex-grow">
                    <Badge className="w-fit">{blog.category}</Badge>
                    <CardTitle className="text-xl md:text-2xl line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-4 leading-5">
                      {blog.excerpt}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-6 mt-auto">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {calculateReadTime(blog.content)}
                    </div>
                  </CardFooter>
                  <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SkeletonBlogCard() {
  return (
    <Card className="cursor-pointer h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 flex-grow">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 mt-auto">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-4" />
      </CardFooter>
    </Card>
  );
}
