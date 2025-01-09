import { WavyText } from "./wavy-text";
import { GradientBackground } from "./gradient-background";
import { Particles } from "./particles";

export function ProcessingAnimation() {
  return (
    <div className="relative w-full aspect-video bg-background/50 overflow-hidden">
      <GradientBackground />
      <div className="relative z-10 h-full flex items-center justify-center">
        <WavyText />
      </div>
      <Particles />
    </div>
  );
}
