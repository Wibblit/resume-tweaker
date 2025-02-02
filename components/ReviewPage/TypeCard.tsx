import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TypeCardProps {
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
}: TypeCardProps) {
  return (
    <div className="relative p-8 rounded-2xl border bg-card hover-lift">
      {isPro && (
        <span className="absolute -top-3 -right-3 px-6 py-1.5 bg-gradient-to-br  text-primary-foreground from-zinc-700/80 via-zinc-400 to-zinc-700/80 dark:from-zinc-400/80 dark:via-zinc-200 dark:to-zinc-400/80 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full">
          Pro
        </span>
      )}

      <div className="mb-6">
        <span className="inline-block p-4 rounded-xl bg-primary/10">
          {icon}
        </span>
      </div>

      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">{description}</p>

      <div className="space-y-4 mb-8">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={cn(
          "w-full shadow-lg transition-all duration-300 hover:shadow-xl",
          isPro 
        )}
        onClick={action}
        variant={isPro ? "silver" : "cardButton"}
      >
        Start {title}
      </Button>
    </div>
  );
}