"use client";
import { ParallaxScroll } from "../ui/parallax-scroll";

export function TemplatesSection() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-extrabold sm:text-4xl bg-clip-text text-center text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
        Stand Out with Customizable Resume Templates
      </h1>
      <p className="my-4 text-xl text-muted-foreground">
        Tailor professional templates to match your unique style and career
        goals
      </p>
      <div className="mt-6">
        <ParallaxScroll images={images} />
      </div>
    </div>
  );
}

const images = [
  "/templates/template1.png",
  "/templates/template2.jpg",
  "/templates/template3.jpg",
  "/templates/template4.png",
  "/templates/template5.png",
  "/templates/ctemplate1.png",
  "/templates/ctemplate2.png",
  "/templates/ctemplate3.png",
  "/templates/ctemplate4.png",
  "/templates/ctemplate5.png",
];
