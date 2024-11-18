import { cn } from "@/lib/utils";

interface ProcessStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  video: string;
  index: number;
}

export function ProcessStep({ title, description, icon, video, index }: ProcessStepProps) {
  return (
    <div className="relative group">
      <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg">
        <div className="mb-4">
          <span className="inline-block p-3 rounded-lg bg-primary/10">
            {icon}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        {/* Video Preview */}
        <div className="mt-4 aspect-video rounded-lg bg-zinc-900/10 dark:bg-zinc-100/10 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            src={video}
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
            <span className="text-sm text-muted-foreground">
              Hover to preview
            </span>
          </div>
        </div>

        {/* Step Number */}
        <div className={cn(
          "absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
          "bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary text-primary-foreground"
        )}>
          {index + 1}
        </div>
      </div>
    </div>
  );
}