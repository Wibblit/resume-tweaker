import { featuredBlogs as latestBlogs } from "@/data/BlogsData"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { ArrowUpRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LatestBlogs() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl mb-8">
          Latest Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestBlogs.length > 0 &&
            latestBlogs.map((blog) => (
              <Link href={`blogs/${blog.id}`} key={blog.id} className="group">
                <Card className="cursor-pointer h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                  <CardHeader className="p-0">
                    <div className="overflow-hidden">
                      <img
                        src={blog.image}
                        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                        alt={blog.title}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 p-6 flex-grow">
                    <Badge className="w-fit">{blog.category}</Badge>
                    <CardTitle className="text-xl md:text-2xl line-clamp-2">{blog.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{blog.content}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-6 mt-auto">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {blog.date}
                    </div>
                    <div className="flex items-center text-primary group-hover:underline">
                      <span>Read more</span>
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}