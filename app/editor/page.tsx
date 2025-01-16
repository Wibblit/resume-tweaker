"use client";

import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/gradient-text";
import { FileText, Wand2, PenTool, FileJson, FileIcon as FilePdf, Layout, Palette, Type, MoveVertical, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TypeCard } from "@/components/ReviewPage/TypeCard";

const features = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Custom Sections",
    description: "Create and organize custom sections to highlight your unique experiences and skills.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_1-transcode.mp4",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "AI Assistance",
    description: "Get real-time suggestions and improvements as you write your content.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_2-transcode.mp4",
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Multiple Templates",
    description: "Choose from a variety of professional templates to match your style.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_3-transcode.mp4",
  },
  {
    icon: <Type className="w-6 h-6" />,
    title: "Font Selection",
    description: "Customize your document with professional fonts for better readability.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_4-transcode.mp4",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Color Themes",
    description: "Apply different color schemes to make your documents stand out.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_5-transcode.mp4",
  },
  {
    icon: <MoveVertical className="w-6 h-6" />,
    title: "Drag & Drop Sections",
    description: "Easily reorganize sections to create the perfect layout.",
    video: "https://assets.website-files.com/6437b5235154004a36c33925/64386032d3aac9a0e45bdc82_Video_6-transcode.mp4",
  },
];

function EditorPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="container relative max-w-7xl mx-auto px-4 pt-20 pb-32 mt-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
            Create Professional Documents with
            <br />
            <GradientText className="text-5xl md:text-7xl mt-2 animate-[float_6s_ease-in-out_infinite]">
              AI-Powered Editor
            </GradientText>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Craft compelling resumes and cover letters with our intelligent editor. 
            Get AI assistance, choose from multiple templates, and customize every detail.
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl "
              onClick={() => router.push("/#join")}
            >
              <FileText className="w-6 h-6 mr-2" />
              Create Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm bg-background/50"
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

        <div className="grid lg:grid-cols-[1fr,2fr] gap-16">
          {/* Feature Navigation */}
          <div className="relative space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-full group relative rounded-xl p-4 transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-primary/5 shadow-lg' 
                    : 'hover:bg-primary/5'
                }`}
              >
                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 ${
                  activeFeature === index ? 'opacity-100' : 'group-hover:opacity-40'
                }`}>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_2s_infinite]" />
                </div>

                <div className="relative flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-opacity-10`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1 text-left ">
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                    activeFeature === index ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Feature Preview */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-muted/10 p-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-20" />
            
            {/* Video Container */}
            <div className="relative h-full rounded-xl overflow-hidden bg-muted/30 backdrop-blur-sm">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeFeature === index 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br`} />
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={feature.video} type="video/mp4" />
                  </video>
                  
                  {/* Feature Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-opacity-20`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <div className="px-3 text-sm text-muted-foreground">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="container mx-auto max-w-7xl px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent rounded-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-center mb-16">
            <GradientText className="animate-[shine_8s_ease-in-out_infinite] bg-[size:200%_auto]">Choose Your Document</GradientText>
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
          <GradientText className="animate-[shine_8s_ease-in-out_infinite] bg-[size:200%_auto]">AI-Powered Assistance, baked in.</GradientText>
        </h2>
        <p className="text-muted-foreground px-8 mx-auto leading-relaxed mb-4 max-w-3xl text-center">
            Both AI Generate and AI Assist are seamlessly integrated into our rich text editor, 
            allowing you to leverage AI power exactly when you need it during the writing process.
          </p>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="space-y-8 p-8 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm bg-background/10 border border-background/20">
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
              {["Create section drafts", "Generate achievement statements", "Craft compelling summaries"].map((item, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="space-y-8 p-8 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm bg-background/10 border border-background/20">
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
              {["Improve language and tone", "Suggest stronger action verbs", "Optimize content structure"].map((item, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <GradientText className="animate-[float_6s_ease-in-out_infinite]">Start Creating Your Professional Documents</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Create compelling resumes and cover letters that stand out with our AI-powered editor.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          onClick={() => router.push("/#join")}
        >
          Get Started Now
        </Button>
      </section>
    </div>
  );
}

export default EditorPage;