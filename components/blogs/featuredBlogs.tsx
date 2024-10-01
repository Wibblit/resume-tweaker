import Image from "next/image"
import Link from "next/link"
import { featuredBlogs } from "@/data/BlogsData"
import { Badge } from "../ui/badge"
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react"

export default function BentoGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
          Featured Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBlogs.map((blog, index) => (
          <Link
            key={index}
            href={`blogs/${blog.id}`}
            className={`group relative overflow-hidden rounded-xl ${
              index === 0
                ? "md:col-span-2 md:row-span-2"
                : index === featuredBlogs.length - 1
                ? "md:col-span-2"
                : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 transition-opacity group-hover:opacity-80" />
            <Image
              src={blog.image}
              alt={blog.title}
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/20 via-transparent to-transparent">
              <Badge className="w-fit mb-3">
                {blog.category}
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{blog.title}</h3>
              <p className="text-sm md:text-lg text-gray-200 mb-4">{blog.excerpt}</p>
              <div className="flex items-center text-xs md:text-base text-gray-300 space-x-4">
                <span className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {blog.date}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {blog.readTime}
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRightIcon className="w-4 h-4 text-white" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}