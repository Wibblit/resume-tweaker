"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  User,
  Zap,
  Eye,
  ChevronUp,
  ExternalLink,
  ChevronDown,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/blogs/BlogBreadCrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { deleteBlog } from "@/actions/deleteblog";
import { Blog } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { ShareComponent } from "./ShareComponent";
import { useToast } from "@/hooks/use-toast";

interface BlogPostProps {
  data: Blog;
}

export default function BlogPost({ data }: BlogPostProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [sparkCount, setSparkCount] = useState<number>(0);
  const [hasSparked, setHasSparked] = useState<boolean>(false);
  const [showSparkAnimation, setShowSparkAnimation] = useState<boolean>(false);
  const [views, setViews] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showAllToc, setShowAllToc] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const setData = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const sessionData = await res.json();
        setSession(sessionData);

        setBlog(data);
        setSparkCount(data.spark);
        setViews(data.views);

        const sparkedBlogs = JSON.parse(
          localStorage.getItem("sparkedBlogs") || "[]",
        );
        setHasSparked(sparkedBlogs.includes(data.id));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    setData();
  }, [data]);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const headings = contentRef.current?.querySelectorAll("h2, h3");
    headings?.forEach((heading) => observer.observe(heading));

    return () => {
      headings?.forEach((heading) => observer.unobserve(heading));
    };
  }, [blog]);

  const handleSparkClick = async () => {
    if (!hasSparked && blog) {
      try {
        setSparkCount((prev) => prev + 1);
        setShowSparkAnimation(true);
        setHasSparked(true);
        const response = await fetch(`/api/increment-spark/${blog.slug}`, {
          method: "POST",
        });
        if (response.ok) {
          const sparkedBlogs = JSON.parse(
            localStorage.getItem("sparkedBlogs") || "[]",
          );
          sparkedBlogs.push(blog.id);
          localStorage.setItem("sparkedBlogs", JSON.stringify(sparkedBlogs));

          setTimeout(() => setShowSparkAnimation(false), 1000);
        } else {
          console.error("Failed to increment Spark count");
          setTimeout(() => setShowSparkAnimation(false), 1000);
        }
      } catch (error) {
        console.error("Failed to increment Spark count:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const result = await deleteBlog(blog?.slug || "");
        if (result.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        if (result.success) {
          router.push("/blogs");
        } else {
          console.error("Failed to delete blog post:", result.message);
        }
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 64; // Adjust this value based on your navbar height
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const TableOfContents = ({ isMobile = false }: { isMobile?: boolean }) => {
    const visibleItems = showAllToc
      ? blog?.tableOfContents
      : blog?.tableOfContents?.slice(0, 4);

    return (
      <div
        className={`my-4 md:my-0 border rounded-lg p-4 bg-background ${
          isMobile ? "lg:hidden" : "hidden lg:block"
        }`}
      >
        <h3 className="font-semibold mb-4">Table of Contents</h3>
        <nav className="space-y-2">
          {visibleItems?.map((item) => {
            const sanitizedId = item
              .toLowerCase()
              .replace(/,/g, "")
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");

            return (
              <a
                key={sanitizedId}
                href={`#${sanitizedId}`}
                onClick={(e) => scrollToSection(e, `#${sanitizedId}`)}
                className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${
                  activeSection === sanitizedId
                    ? "text-foreground font-medium"
                    : ""
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>
        {blog?.tableOfContents && blog.tableOfContents.length > 4 && (
          <Button
            variant="ghost"
            className="mt-2 w-full text-sm"
            onClick={() => setShowAllToc(!showAllToc)}
          >
            {showAllToc ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <article className="container mt-8 mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumbs currPage={blog.title} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-10">
        <div>
          <header className="mb-8">
            <Badge className="mb-6 mt-4">{blog.category}</Badge>
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6">
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
            </div>
          </header>
          <div className="relative w-full md:h-[400px] h-auto mb-4 md:mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              height={600}
              width={600}
              className="md:object-cover object-contain w-full h-auto"
              priority
            />
          </div>
          {/* Table of Contents for mobile */}
          <div className="md:hidden">
            <ShareComponent
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`}
              title={blog.title}
            />
          </div>
          <TableOfContents isMobile={true} />
          {blog.excerpt && (
            <p className="text-gray-400 text-lg">{blog.excerpt}</p>
          )}
          <Separator className="my-8" />
          <div
            ref={contentRef}
            className="prose max-w-none dark:prose-invert md:text-xl text-lg [&>h2]:pt-20 [&>h2]:mt-0 [&>h3]:pt-20 [&>h3]:mt-0"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-y-4 w-full ">
              <Button variant="outline" asChild className="w-full md:w-auto">
                <Link href="/blogs">Back to all blogs</Link>
              </Button>
              {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/blogs/edit/${blog.slug}`}>Edit</Link>
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
              <div className="flex-col md:flex-row flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleSparkClick}
                  disabled={hasSparked}
                  className={`relative w-full xs:w-auto ${
                    hasSparked ? "bg-yellow-100 dark:bg-yellow-900" : ""
                  }`}
                >
                  <Zap
                    className={`h-5 w-5 mr-2 ${
                      hasSparked ? "text-yellow-400" : ""
                    }`}
                  />
                  Spark {sparkCount > 0 && `(${sparkCount})`}
                  <AnimatePresence>
                    {showSparkAnimation && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap className="h-8 w-8 text-yellow-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                <Button className="w-full xs:w-auto">
                  <Link href="/" className="flex items-center justify-center">
                    Try Our Product <ExternalLink className="ml-2 h-4  w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 hidden md:block">
          <div className="lg:sticky lg:top-20 space-y-6">
            <ShareComponent
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blog.slug}`}
              title={blog.title}
            />
            <TableOfContents />
            <div className="border rounded-lg overflow-hidden bg-background">
              <Image
                src="/brand-image.png"
                alt="Brand promotion"
                width={200}
                height={180}
                className="object-contain w-full h-auto"
              />
              <div className="p-4 w-full">
                <h4 className="font-semibold mb-2">Your Resume, Elevated</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Take your career to the next level! Start building your resume
                  today at no cost—your journey begins here!
                </p>
                <Link
                  href="/"
                  className="text-sm text-secondary font-semibold py-2 my-2 w-full bg-primary rounded-lg flex items-center justify-center"
                >
                  <span className="hover:scale-105">
                    Build Your Resume - Free forever
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 rounded-full p-2"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </article>
  );
}
