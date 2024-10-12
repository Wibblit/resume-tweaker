"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogPost from "@/components/blogs/blogPost";
import { Session } from "next-auth";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/session");
      const sessionData = await response.json();
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  return <BlogPost session={session} slug={slug} />;
}
