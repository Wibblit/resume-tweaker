'use client'
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/gradient-text";
import { TypeCard } from "@/components/ReviewPage/TypeCard";
import { ProcessStep } from "@/components/ReviewPage/ProcessStep";
import {
  Brain,
  Workflow,
  LineChart,
  Video,
  FileSpreadsheet,
  Award,
} from "lucide-react";
import InterviewResults from "@/components/Interview/interviewResults";
import { useRouter } from "next/navigation";
import Link from "next/link";


const dummyData = {
  evaluation: [
    {
      category: "Subject Knowledge",
      score: 8.5,
      comment:
        "Demonstrated strong understanding of core concepts and technologies.",
      likes: ["knowledgeable", "up-to-date", "comprehensive"],
      dislikes: ["occasional hesitation", "limited depth", "narrow focus"],
    },
    {
      category: "Communication Skills",
      score: 7.8,
      comment:
        "Articulated ideas clearly, but could improve on technical explanations.",
      likes: ["articulate", "confident", "engaging"],
      dislikes: ["technical jargon", "rushed explanations", "interrupted"],
    },
    {
      category: "Problem-Solving Ability",
      score: 9.0,
      comment:
        "Excellent approach to solving complex problems with innovative solutions.",
      likes: ["analytical", "creative", "efficient"],
      dislikes: ["overcomplicates", "time management", "assumption-based"],
    },
    {
      category: "Response Structure",
      score: 8.2,
      comment: "Well-organized responses, but occasionally lacked conciseness.",
      likes: ["organized", "logical", "comprehensive"],
      dislikes: ["verbose", "tangential", "repetitive"],
    },
    {
      category: "Professionalism and Attitude",
      score: 9.5,
      comment:
        "Displayed exceptional professionalism and a positive, enthusiastic attitude.",
      likes: ["enthusiastic", "respectful", "adaptable"],
      dislikes: ["overeager", "interrupts", "informal"],
    },
  ],
  overall_score: 8.6,
  final_recommendation: "Strongly Recommend for Hire",
  overall_comment:
    "The candidate demonstrated exceptional skills across all evaluated areas, particularly excelling in problem-solving and professionalism. Their strong subject knowledge and communication skills make them a valuable asset to any team.",
  comment_keywords: {
    positive: ["innovative", "knowledgeable", "professional"],
    negative: ["verbose", "technical jargon", "occasional hesitation"],
  },
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

function InterviewPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"></div>
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
        <div className="flex gap-4 flex-wrap justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-primary"
            onClick={() => router.push("/#join")}
          >
            <Video className="w-6 h-6 mr-2" />
            Start Interview
          </Button>
          <Link href='/#join'>
            <Button
              size="lg"
              variant="outline"
              // onClick={() => {
              //   const featuresSection =
              //     document.getElementById("interview-styles");
              //   featuresSection?.scrollIntoView({ behavior: "smooth" });
              // }}
            >
              Learn More
            </Button>
          </Link>
        </div>

        {/* Video Placeholder */}
        <div className="w-full">
          <div className="mt-16 rounded-xl max-w-7xl bg-zinc-900/5 dark:bg-zinc-100/5 p-2 border-2 border-zinc-900/10 dark:border-zinc-100/10">
            <div className="aspect-video rounded-lg bg-zinc-900/10 dark:bg-zinc-100/10 flex items-center justify-center">
              <iframe
                loading="lazy"
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/algtoUPPyq8"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
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
              router.push("/#join")
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
            action={() => router.push("/#join")}
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
          onClick={() => router.push("/#join")}
        >
          Begin Your Practice Interview
        </Button>
      </section>
    </div>
  );
}

export default InterviewPage;
