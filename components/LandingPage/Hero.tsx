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
    <div className="min-h-[calc(100vh-4rem)] w-full relative flex flex-col items-center justify-center antialiased bg-transparent overflow-hidden ">

      <div className="container px-4 md:px-6 flex flex-col items-center justify-center z-10 relative">
        <div className="text-center space-y-4">
          <span className='inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border bg-[linear-gradient(110deg,#fff,45%,#dbdbdb,55%,#fff)] dark:bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>
            <Sparkles className="mr-2 h-4 w-4 text-secondary-foreground" />
            <span className="text-secondary-foreground">Supercharge your Job Search</span>
          </span>
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Elevate your career with<br className="hidden sm:inline" />
            <WordRotate
              words={["Resumes", "Cover Letters", "Reviews", "Interviews"]}
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
            <Button asChild size="lg" variant={"silver"}>
              <a href="login">
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
