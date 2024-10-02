import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginSkeleton() {
    return(
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg">
        <CardHeader className="space-y-1">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-md" />
            ))}
          </div>
        </CardFooter>
      </Card>
    )
}

