"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Zap, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/BlogBreadCrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/auth";
import { Session } from "next-auth";

interface BlogPostProps {
    session: Session | null; // Explicitly type the session prop
    slug : string
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  thumbnail: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: string[];
  Spark: number;
  views: number;
}

export default function BlogPost({ session, slug }: BlogPostProps) {
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [sparkCount, setSparkCount] = useState<number>(0);
  const [hasSparked, setHasSparked] = useState<boolean>(false);
  const [showSparkAnimation, setShowSparkAnimation] = useState<boolean>(false);
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/get-blogs/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data);
        setSparkCount(data.spark);
        setViews(data.views);

        // Check if the blog has been sparked in local storage
        const sparkedBlogs = JSON.parse(
          localStorage.getItem("sparkedBlogs") || "[]"
        );
        setHasSparked(sparkedBlogs.includes(data.id));
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const incrementViews = async () => {
      if (blog) {
        try {
          const response = await fetch(`/api/blogs/${blog.id}/views`, {
            method: "POST",
          });
          if (response.ok) {
            const data = await response.json();
            setViews(data.views);
          }
        } catch (error) {
          console.error("Failed to increment view count:", error);
        }
      }
    };
    incrementViews();
  }, [blog]);

  const handleSparkClick = async () => {
    if (!hasSparked && blog) {
      try {
        const response = await fetch(`/api/increment-spark/${blog.slug}`, {
          method: "POST",
        });

        if (response.ok) {
          setSparkCount((prev) => prev + 1);
          setShowSparkAnimation(true);
          setHasSparked(true);

          // Store the sparked blog ID in local storage
          const sparkedBlogs = JSON.parse(
            localStorage.getItem("sparkedBlogs") || "[]"
          );
          sparkedBlogs.push(blog.id);
          localStorage.setItem("sparkedBlogs", JSON.stringify(sparkedBlogs));

          // Hide the spark animation after a short delay
          setTimeout(() => setShowSparkAnimation(false), 500);
        } else {
          console.error("Failed to increment Spark count");
        }
      } catch (error) {
        console.error("Failed to increment Spark count:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/blogs/${blog?.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          router.push("/blogs");
        } else {
          console.error("Failed to delete blog post");
        }
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  };

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <article className="container mt-8 mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs currPage={blog.title} />
      <header className="mb-8">
        <Badge className="mb-6 mt-4">{blog.category}</Badge>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center text-muted-foreground gap-4">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {Math.ceil(blog.content.split(" ").length / 200)} min read
            </span>
          </div>
          <div className="flex gap-x-1 items-center">
            <Zap className="h-6 w-6 text-yellow-400" />
            <span>{sparkCount}</span>
          </div>
          <div className="flex gap-x-1 items-center">
            <Eye className="h-6 w-6" />
            <span>{views}</span>
          </div>
        </div>
      </header>
      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.excerpt && (
        <p className="text-lg text-muted-foreground mb-8">{blog.excerpt}</p>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/blogs">Back to all blogs</Link>
          </Button>
          {session?.user?.email === process.env.ADMIN_EMAIL && (
            <>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href={`/blogs/${blog.slug}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleSparkClick}
            disabled={hasSparked}
            className={`relative w-full xs:w-auto ${
              hasSparked ? "bg-yellow-100 dark:bg-yellow-900" : ""
            }`}
          >
            <Zap
              className={`h-5 w-5 mr-2 ${hasSparked ? "text-yellow-400" : ""}`}
            />
            Spark {sparkCount > 0 && `(${sparkCount})`}
            <AnimatePresence>
              {showSparkAnimation && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  💥
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </article>
  );
}
