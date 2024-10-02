"use client";
import LatestBlogs from "@/components/blogs/latestBlogs";
import FeaturedBlogs from "@/components/blogs/featuredBlogs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";

export default function Blogs() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/blogs/create");
    }
    return(
        <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto my-20 sm:px-10 px-5">
            <div className="max-w-7xl w-full">
                <div className="w-full text-center py-8">
                    <Button onClick={() => handleClick()} className="w-[50vw] py-8 text-xl">
                        <span className="mr-3">Add</span>
                        <Plus />
                    </Button>
                </div>
                <FeaturedBlogs />
                <Separator />
                <LatestBlogs />
            </div>
        </main>
    )
}
