import { cn } from "@/lib/utils";
import { ProcessingAnimation } from "../processing-animation";

interface ProcessStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  video?: string;
  index: number;
}

export function ProcessStep({
  title,
  description,
  icon,
  video,
  index,
}: ProcessStepProps) {
  return (
    <div className="relative group">
      <div className="p-6 rounded-xl border bg-card transition-all duration-300">
        <div className="mb-4">
          <span className="inline-block p-3 rounded-lg bg-primary/10">
            {icon}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>

        {/* Media Preview */}
        <div className="mt-4">
          <div className="rounded-lg overflow-hidden border border-border/50 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.3)]">
            {!video ? (
              <ProcessingAnimation />
            ) : (
              <video
                className="w-full aspect-video object-contain"
                src={video}
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              />
            )}
          </div>
        </div>

        {/* Step Number */}
        <div
          className={cn(
            "absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
            "bg-gradient-to-br text-primary-foreground from-zinc-800/80 via-zinc-500/80 to-zinc-800/80 dark:from-zinc-400/80 dark:via-zinc-200 dark:to-zinc-400/80 transition-all duration-500 easeInOut shadow-lg hover:shadow-xl"
          )}
        >
          {index + 1}
        </div>
      </div>
    </div>
  );
}
