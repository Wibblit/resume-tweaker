import { cn } from "@/lib/utils";

export function WavyText() {
  const text = "AI Processing...";

  return (
    <div className="relative flex items-center justify-center">
      <div className="flex space-x-[2px]">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className={cn(
              "text-xl font-semibold text-primary/80",
              "animate-bounce transition-all duration-500",
              "hover:text-primary"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "1s",
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
