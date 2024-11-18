"use client";

import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/gradient-text";
import { FeatureCard } from "@/components/featured-card";
import {
  Brain,
  Workflow,
  LineChart,
  Video,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import { Feature } from "@/components/LandingPage/FeatureComponent";
import InterviewResults from "@/components/Interview/interviewResults";
import Footer from "@/components/LandingPage/Footer";
import { LandingNav } from "@/components/LandingPage/LandingNav";

const dummyData = {
  evaluation: [
    {
      category: "Subject Knowledge",
      score: 8.5,
      comment:
        "Demonstrated strong technical knowledge and industry awareness.",
    },
    {
      category: "Communication Skills",
      score: 9.0,
      comment:
        "Excellent verbal communication with clear and concise responses.",
    },
    {
      category: "Problem-Solving Ability",
      score: 7.5,
      comment: "Good analytical approach to complex scenarios.",
    },
    {
      category: "Response Structure",
      score: 8.0,
      comment: "Well-organized answers following the STAR method.",
    },
    {
      category: "Professionalism and Attitude",
      score: 9.5,
      comment: "Highly professional demeanor with positive attitude.",
    },
  ],
  overall_score: 8.5,
  final_recommendation: "Strongly Recommended for Hire",
  overall_comment:
    "An exceptional candidate who demonstrates strong technical skills and professional qualities.",
};

const features = [
  {
    title: "Setup Your Interview",
    description:
      "Customize your interview by selecting job role, position, and duration. Upload your resume and JD for personalized questions.",
    icon: <FileSpreadsheet className="w-6 h-6" />,
  },
  {
    title: "Take the Interview",
    description:
      "Answer questions in a realistic video environment. Control your pace with options to start, pause, and skip questions.",
    icon: <Video className="w-6 h-6" />,
  },
  {
    title: "Get Detailed Analysis",
    description:
      "Receive comprehensive feedback with scores across multiple categories and actionable improvement suggestions.",
    icon: <LineChart className="w-6 h-6" />,
  },
];

function App() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <LandingNav />
      </div>
      <section className="container max-w-7xl mx-auto px-4 pt-20 pb-32 mt-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Master Your Next Interview with
          <br />
          <GradientText className="text-5xl md:text-7xl">
            AI-Powered Practice
          </GradientText>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience realistic interview simulations with advanced AI
          technology. Perfect your responses and boost your confidence.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary"
          >
            <Video className="w-6 h-6" />
            Start Interview
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </Button>
        </div>

        {/* Video Placeholder */}
        <div className="w-full">
          <div className="mt-16 rounded-xl max-w-7xl bg-zinc-900/5 dark:bg-zinc-100/5 p-2 border-2 border-zinc-900/10 dark:border-zinc-100/10">
            <div className="aspect-video rounded-lg bg-zinc-900/10 dark:bg-zinc-100/10 flex items-center justify-center">
              <p className="text-muted-foreground">Interview Demo Video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          <GradientText>Choose Your Interview Style</GradientText>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="Comprehensive Interview"
            description="Pre-generated questions covering all aspects of your role. Perfect for thorough preparation and consistent evaluation."
          />
          <FeatureCard
            icon={<Workflow className="w-6 h-6" />}
            title="Adaptive Interview"
            description="Dynamic questions that adjust based on your responses. Experience a more realistic and challenging interview flow."
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">
          <GradientText>How It Works</GradientText>
        </h2>
        <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-content-center mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      {/* Evaluation Section */}
      <section className="mx-auto px-4 py-20 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-24">
          <GradientText>Comprehensive Evaluation</GradientText>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">We Evaluate:</h3>
            <div className="space-y-4">
              {[
                "Subject Knowledge",
                "Communication Skills",
                "Problem-Solving Ability",
                "Response Structure",
                "Professionalism and Attitude",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto w-full">
            <InterviewResults isStatic={true} data={dummyData} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <GradientText>Ready to Ace Your Interview?</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start practicing now and get comprehensive feedback to improve your
          interview skills.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary"
        >
          Begin Your Practice Interview
        </Button>
      </section>
      <section className="w-full" id="footer">
        <hr className="border-t" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex justify-center items-center pb-6">
          <Footer />
        </div>
      </section>
    </div>
  );
}

export default App;
