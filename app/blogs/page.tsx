import LatestBlogs from "@/components/blogs/latestBlogs";
import FeaturedBlogs from "@/components/blogs/featuredBlogs";
import { AdminAddButton } from "@/components/AdminAddButton";
import { Separator } from "@radix-ui/react-separator";
import { auth } from "@/auth";

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