"use client";

//@ts-ignore
import { ParallaxScroll } from "../ui/parallax-scroll";

export function TemplatesSection() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl bg-clip-text text-center text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
        Stand Out with Customizable Resume Templates
      </h1>
      <p className="my-4 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
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
  "/templates/template1.avif",
  "/templates/template2.avif",
  "/templates/template3.avif",
  "/templates/template4.avif",
  "/templates/template5.avif",
  "/templates/template6.avif",
  "/templates/template7.avif",
  "/templates/jonathandoesmithresume-1.jpg",
  "/templates/template8.avif",
  "/templates/template9.avif",
  "/templates/ctemplate1.avif",
  "/templates/ctemplate2.avif",
  "/templates/ctemplate3.avif",
  "/templates/ctemplate4.avif",
  "/templates/ctemplate5.avif",
];
