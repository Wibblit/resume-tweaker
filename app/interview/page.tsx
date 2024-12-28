"use client";

import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/gradient-text";
import { TypeCard } from "@/components/ReviewPaage/TypeCard";
import { ProcessStep } from "@/components/ReviewPaage/ProcessStep";
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
import { useRouter } from "next/navigation";

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

const processSteps = [
  {
    title: "Setup Your Interview",
    description:
      "Customize your interview by selecting job role, position, and duration. Upload your resume and JD for personalized questions.",
    icon: <FileSpreadsheet className="w-6 h-6" />,
    video: "/videos/interview-video-1.mp4",
  },
  {
    title: "Take the Interview",
    description:
      "Answer questions in a realistic video environment. Control your pace with options to start, pause, and skip questions.",
    icon: <Video className="w-6 h-6" />,
    video: "/videos/interview-video-2.mp4",
  },
  {
    title: "Get Detailed Analysis",
    description:
      "Receive comprehensive feedback with scores across multiple categories and actionable improvement suggestions.",
    icon: <LineChart className="w-6 h-6" />,
    video: "/videos/interview-video-3.mp4",
  },
];

function App() {
  const router = useRouter();
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
            onClick={() => router.push("/ai-interview")}
          >
            <Video className="w-6 h-6" />
            Start Interview
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const featuresSection =
                document.getElementById("interview-styles");
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
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/algtoUPPyq8"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="no-referrer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="interview-styles"
        className="container mx-auto max-w-7xl px-4 py-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          <GradientText>Choose Your Interview Style</GradientText>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <TypeCard
            icon={<Brain className="w-6 h-6" />}
            title="Comprehensive Interview"
            description="Pre-generated questions covering all aspects of your role. Perfect for thorough preparation and consistent evaluation."
            features={[
              "Covers Key Competency Areas",
              "Standardized Evaluation Criteria",
              "Detailed Feedback on Every Question",
              "Ideal for Structured Interview Preparation",
            ]}
            action={() =>
              router.push("/ai-interview?interviewStyle=comprehensive")
            }
          />
          <TypeCard
            icon={<Workflow className="w-6 h-6" />}
            title="Adaptive Interview"
            description="Dynamic questions that adjust based on your responses. Experience a more realistic and challenging interview flow."
            features={[
              "Questions Tailored to Your Responses",
              "Real-Time Adaptation",
              "Simulates Real-World Interview Dynamics",
              "Challenging and Engaging Practice",
            ]}
            action={() => router.push("/ai-interview?interviewStyle=adaptive")}
            isPro
          />
        </div>

        {/* Process Steps */}
        <h2 className="text-3xl font-bold text-center mb-12">
          <GradientText>How It Works</GradientText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <ProcessStep key={index} {...step} index={index} />
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
          onClick={() => router.push("/ai-interview")}
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
