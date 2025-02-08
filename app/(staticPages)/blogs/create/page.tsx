import BlogForm from "@/components/blogs/BlogSubmition";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateBlogs() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return redirect("/blogs")
  }
  return <BlogForm />;
}
