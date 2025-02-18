import LatestBlogs from "@/components/blogs/latestBlogs";
import FeaturedBlogs from "@/components/blogs/featuredBlogs";
import { AdminAddButton } from "@/components/blogs/AdminAddButton";
import { Separator } from "@radix-ui/react-separator";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:"ResumeTweaker Blog | Career Advice and Job Search Tips"},
  description:
    "Explore ResumeTweaker's blog for expert career advice, resume tips, and job search strategies to advance your professional journey.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/blogs",
  },
  keywords: [
    "career advice blog",
    "job search tips",
    "resume writing tips",
    "interview preparation advice",
    "job application strategies",
    "career development blog",
    "job hunting tips",
    "resume building advice",
    "job search strategies",
    "career coaching blog",
    "professional development articles",
    "job market insights",
    "resume optimization tips",
    "interview coaching blog",
    "career growth strategies",
  ],
};


export default async function Blogs() {
  const session = await auth();
  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto my-20 sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        {session?.user?.email === process.env.ADMIN_EMAIL && <AdminAddButton />}
        <FeaturedBlogs />
        <Separator />
        <LatestBlogs />
      </div>
    </main>
  );
}