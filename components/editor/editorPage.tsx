'use client'
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/gradient-text"
import {
  FileText,
  Wand2,
  PenTool,
  FileJson,
  FileIcon as FilePdf,
  Layout,
  Palette,
  Type,
  MoveVertical,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TypeCard } from "@/components/ReviewPage/TypeCard"
import type { RefObject } from "react"
import React from "react"

const features = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Custom Sections",
    description: "Create and organize custom sections to highlight your unique experiences and skills.",
    video: "/videos/editor-features/custom-sections.mp4",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "AI Assistance",
    description: "Get real-time suggestions and improvements as you write your content.",
    video: "/videos/editor-features/aiassist.mp4",
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Multiple Templates",
    description: "Choose from a variety of professional templates to match your style.",
    video: "/videos/editor-features/templates.mp4",
  },
  {
    icon: <Type className="w-6 h-6" />,
    title: "Font Selection",
    description: "Customize your document with professional fonts for better readability.",
    video: "/videos/editor-features/fonts.mp4",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Color Themes",
    description: "Apply different color schemes to make your documents stand out.",
    video: "/videos/editor-features/colors.mp4",
  },
  {
    icon: <MoveVertical className="w-6 h-6" />,
    title: "Drag & Drop Sections",
    description: "Easily reorganize sections to create the perfect layout.",
    video: "/videos/editor-features/sections.mp4",
  },
]

function EditorPage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState(0)
  const videoRefs = useRef<RefObject<HTMLVideoElement>[]>(features.map(() => React.createRef<HTMLVideoElement>()))

  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      if (ref.current) {
        if (index === activeFeature) {
          ref.current.currentTime = 0
          ref.current.play().catch((error) => console.error("Error playing video:", error))
        } else {
          ref.current.pause()
        }
      }
    })
  }, [activeFeature])

  return (
    <div className="min-h-screen ">
      <div className="bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,black_95%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_95%,transparent)]">
        
      {/* Hero Section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#000,transparent)] -z-20"></div>
      <section className="container relative max-w-7xl mx-auto px-4 pt-20 pb-12 mt-16 text-center overflow-hidden ">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
            Create Professional Documents with
            <br />
            <GradientText className="text-5xl md:text-7xl mt-2">AI-Powered Editor</GradientText>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Craft compelling resumes and cover letters with our intelligent editor. Get AI assistance, choose from
            multiple templates, and customize every detail.
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Button
              size="lg"
              variant={"silver"}
              onClick={() => router.push("/#join")}
            >
              <FileText className="w-6 h-6 mr-2" />
              Create Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-all duration-200 hover:shadow-lg backdrop-blur-sm bg-background/50"
              onClick={() => router.push("/#join")}
              >
              Create Cover Letter
            </Button>
          </div>
        </div>
      </section>

      <section className="container relative mx-auto max-w-7xl px-4 py-32">
        <h2 className="text-4xl font-bold text-center mb-24">
          <GradientText className="animate-[shine_8s_ease-in-out_infinite] bg-[size:200%_auto]">
            Experience the Features
          </GradientText>
        </h2>

        <div className="lg:grid lg:grid-cols-[1fr,2fr] gap-16 hidden">
          {/* Feature Navigation */}
          <div className="relative space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-full group relative rounded-xl p-4 transition-all duration-300 ${
                  activeFeature === index ? "bg-primary/5 shadow-lg" : "hover:bg-primary/5"
                }`}
                >
                <div className="relative flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-opacity-10">{feature.icon}</div>
                  <div className="flex-1 text-left ">
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeFeature === index ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Feature Preview */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-muted/10 p-1 ">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-20" />

            {/* Video Container */}
            <div className="relative h-full rounded-xl overflow-hidden bg-muted/30 ">
              {features.map((feature, index) => (
                <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                    activeFeature === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  >
                  <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-background/5 to-transparent" />
                  <video
                    ref={videoRefs.current[index]}
                    className={`w-full h-full object-cover ${index >= 2 ? 'object-right' : 'object-left'} dark:bg-black bg-white`}
                    loop
                    muted
                    playsInline
                  >
                    <source src={feature.video} type="video/mp4" />
                    <center>Your browser does not support video tags</center>
                  </video>

                  {/* Feature Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg text-white bg-opacity-20">{feature.icon}</div>
                        <h3 className="text-xl text-white font-semibold">{feature.title}</h3>
                      </div>
                      <div className="px-3 text-white">{feature.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="block lg:hidden">
          <div className="flex justify-between sm:justify-center sm:gap-3 px-1 mb-3 sm:mb-6 sm:px-10">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`p-2 sm:p-3 md:p-4 rounded-lg transition-all duration-300  ${
                    activeFeature === index
                      ? 'bg-card text-foreground scale-105 sm:scale-110 border'
                      : 'text-muted-foreground/60 hover:text-foreground/90'
                  }`}
                >
                  <div className="flex-col justify-start">
                    <div className="p-2 rounded-lg bg-opacity-10 sm:inline-block">{feature.icon}</div>
                    <div className="flex-1 text-center hidden sm:inline-block">
                      <h3 className="font-semibold hidden sm:inline-block">{feature.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 sm:mb-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeFeature === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                >
                  <video
                    ref={videoRefs.current[index]}
                    className="w-full h-full object-cover dark:bg-black bg-white"
                    loop
                    muted
                    playsInline
                    autoPlay
                  >
                    <source src={feature.video} type="video/mp4" />
                    <center>Your browser does not support video tags</center>
                  </video>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                      <h3 className="text-lg sm:text-xl md:text-2xl text-white font-semibold">{feature.title}</h3>
                      <p className="text-white/90 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
                    </div>

      {/* Document Types */}
      <section className="container mx-auto max-w-7xl px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent rounded-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-center mb-16">
            <GradientText className="animate-[shine_8s_ease-in-out_infinite] bg-[size:200%_auto]">
              Choose Your Document
            </GradientText>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TypeCard
              icon={<FileText className="w-6 h-6" />}
              title="Resume Editor"
              description="Create a professional resume with customizable sections, AI assistance, and multiple templates."
              features={[
                "Custom sections for experience & skills",
                "AI-powered content suggestions",
                "Multiple professional templates",
                "Export to PDF or JSON format",
                "Real-time AI writing assistance",
              ]}
              action={() => router.push("/#join")}
            />

            <TypeCard
              icon={<FileText className="w-6 h-6" />}
              title="Cover Letter Editor"
              description="Write compelling cover letters with AI assistance and professional templates."
              features={[
                "Customizable letter sections",
                "AI-powered writing suggestions",
                "Professional templates",
                "Export options",
                "Real-time formatting preview",
              ]}
              action={() => router.push("/#join")}
            />
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          <GradientText className="animate-[shine_8s_ease-in-out_infinite] bg-[size:200%_auto]">
            AI-Powered Assistance, baked in.
          </GradientText>
        </h2>
        <p className="text-muted-foreground px-8 mx-auto leading-relaxed mb-4 max-w-3xl text-center">
          Both AI Generate and AI Assist are seamlessly integrated into our rich text editor, allowing you to leverage
          AI power exactly when you need it during the writing process.
        </p>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="space-y-8 p-8 rounded-2xl transition-all duration-200 hover:shadow-lg bg-card backdrop-blur-sm border border-background/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">AI Generate</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generate content instantly with AI when given a prompt:
            </p>
            <ul className="space-y-4">
              {["Create section drafts", "Generate achievement statements", "Craft compelling summaries"].map(
                (item, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </Card>
          <div className="space-y-8 p-8 rounded-2xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm bg-card border border-background/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">AI Assist</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Enhance your already written content with AI:
            </p>
            <ul className="space-y-4">
              {["Improve language and tone", "Suggest stronger action verbs", "Optimize content structure"].map(
                (item, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <GradientText className="animate-[float_6s_ease-in-out_infinite]">
            Start Creating Your Professional Documents
          </GradientText>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Create compelling resumes and cover letters that stand out with our AI-powered editor.
        </p>
        <Button
          size="lg"
          variant={"silver"}
          onClick={() => router.push("/#join")}
        >
          Get Started Now
        </Button>
      </section>
    </div>
  )
}

export default EditorPage

