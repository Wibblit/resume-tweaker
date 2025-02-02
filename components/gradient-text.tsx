import { cn } from "@/lib/utils";

export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-br from-zinc-800 via-zinc-500 to-zinc-800 dark:from-zinc-800 dark:via-zinc-300 dark:to-zinc-800 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
