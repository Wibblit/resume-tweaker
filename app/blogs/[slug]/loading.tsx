import { Skeleton } from "@/components/ui/skeleton"
        
export default function Loading() {
    return (
        <BlogPostSkeleton />
    )
}

function BlogPostSkeleton() {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Skeleton className="h-6 w-40 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    )
  }