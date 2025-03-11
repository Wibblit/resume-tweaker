import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4`}>
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <Skeleton className="h-8 w-32 mx-auto" />
            </CardTitle>
            <CardDescription className="text-center">
              <Skeleton className="h-4 w-64 mx-auto" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            {[1, 2].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} className="h-8 w-8 rounded-md" />
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
