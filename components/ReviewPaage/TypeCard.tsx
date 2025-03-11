import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ReviewTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  isPro?: boolean;
  action: () => void;
}

export function TypeCard({
  icon,
  title,
  description,
  features,
  isPro,
  action,
}: ReviewTypeCardProps) {
  return (
    <div className="relative p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg">
      {isPro && (
        <span className="absolute -top-3 -right-3 px-4 py-1 bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary text-primary-foreground text-sm font-semibold rounded-full">
          Pro
        </span>
      )}

      <div className="mb-4">
        <span className="inline-block p-3 rounded-lg bg-primary/10">
          {icon}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      <div className="space-y-3 mb-6">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={
          isPro
            ? "bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary w-full"
            : "w-full"
        }
        onClick={() => action()}
        variant={isPro ? "default" : "outline"}
      >
        Start {title}
      </Button>
    </div>
  );
}
