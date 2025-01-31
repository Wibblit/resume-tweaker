// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Button } from "../ui/button";
// import { ArrowRight, FileText, Sparkles } from "lucide-react";
// import ResumeAnimation from "./resume-animation";

// export function Hero() {
//   const scrollToTemplates = () => {
//     const ele = document.getElementById("templates");
//     if (ele) {
//       ele.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="min-h-screen w-full relative flex flex-col items-center justify-center antialiased overflow-hidden bg-gradient-to-br from-background via-background/90 to-background/80">
//       <div className="container max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between z-10 gap-8">
//         <motion.div
//           className="max-w-2xl space-y-8 text-center lg:text-left"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
//             <Sparkles className="mr-2 h-4 w-4 text-primary" />
//             <span className="text-muted-foreground">
//               AI-Powered Resume Builder
//             </span>
//           </div>
//           <h1 className="text-4xl sm:text-5xl md:text-[3.3rem] font-bold">
//             Elevate Your Career with{" "}
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
//               AI-Powered Resumes
//             </span>
//           </h1>
//           <p className="text-muted-foreground text-lg max-w-xl">
//             Craft a standout resume with ease using the power of AI. Receive
//             tailored suggestions, optimize your content, and land your dream job
//             faster.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//             <a href="#join">
//               {" "}
//               <Button className="group bg-primary text-primary-foreground hover:bg-primary/90">
//                 Get Started
//                 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </a>

//             <Button
//               onClick={scrollToTemplates}
//               variant="outline"
//               className="group"
//             >
//               View Templates
//               <FileText className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
//             </Button>
//           </div>
//         </motion.div>
//         <ResumeAnimation />
//       </div>
//       <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
//     </div>
//   );
// }
'use client'
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Sparkles } from "lucide-react"
import { WordRotate } from "@/components/ui/word-rotate"

export function Hero() {
  const scrollToTemplates = () => {
    const ele = document.getElementById("templates")
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full relative flex flex-col items-center justify-center antialiased bg-background overflow-hidden">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center z-10 relative">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm mb-4 md:mb-6">
            <Sparkles className="mr-2 h-4 w-4 text-secondary-foreground" />
            <span className="text-secondary-foreground">Supercharge your Job Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Elevate your career with<br className="hidden sm:inline" />
            <WordRotate
              words={["Resumes", "Cover Letters", "Reviews", "Interviews"]}
              className=" bg-gradient-to-br from-primary via-zinc-800 to-zinc-600 dark:from-zinc-800 dark:via-zinc-300 dark:to-zinc-800 bg-clip-text text-transparent animate-gradient"
              duration={2000}
              motionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            />
          </h1>
          <p className="text-muted-foreground max-w-[42rem] text-sm sm:text-base md:text-lg leading-normal sm:leading-7 mx-auto">
            Build standout resumes, craft compelling cover letters, receive expert reviews, and ace your interviews—all
            with AI to land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary via-zinc-600 to-zinc-400 dark:from-zinc-400 dark:via-zinc-200 dark:to-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl ">
              <a href="#join">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" onClick={scrollToTemplates} variant="outline" className="group">
              View Templates
              <FileText className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
