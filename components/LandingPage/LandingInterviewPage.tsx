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
import FAQAccordion from "../faq-accordian";
const faqData = [
  {
    question: "Can AI be used for interview practice?",
    answer: "Yes! ResumeTweaker offers AI-powered mock interviews that simulate real-life interview scenarios. You can practice common questions, get feedback on your answers, and refine your responses to boost your confidence for the big day."
  },
  {
    question: "How do I pass an AI interview?",
    answer: "Practice with ResumeTweaker's AI interview tool! It simulates real-life interview scenarios, provides feedback on your responses, and helps you refine your answers for maximum impact."
  },
  {
    question: "Is there a free AI tool to practice interviews?",
    answer: "Yes! ResumeTweaker offers a AI-powered mock interview tool, allowing you to practice common interview questions and receive helpful tips to improve your performance."
  },
  {
    question: "What is the AI tool for interview voice?",
    answer: "ResumeTweaker includes an AI voice feature that lets you practice voice-based interviews, helping you build confidence for phone or video interviews."
  },
  {
    question: "Which AI is best for interviews?",
    answer: "ResumeTweaker is one of the best AI interview tools, offering adaptive interview flows, question banks, and personalized feedback to help you master your next job interview."
  },
  {
    question: "Can AI take my mock interview?",
    answer: "Absolutely! ResumeTweaker's AI can conduct a mock interview, ask dynamic follow-ups, and analyze your responses to guide your improvement."
  },
  {
    question: "How to crack interviews with AI?",
    answer: "Use ResumeTweaker to prepare! You can practice with mock interviews, get AI-generated answers to tricky questions, and learn how to present your skills confidently."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};


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
    <div className="min-h-screen ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,black_95%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_95%,transparent)]">

        {/* Hero Section */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_300px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_300px,#000,transparent)] -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"></div>
        <section className="container max-w-7xl mx-auto px-4 pt-20 pb-32 mt-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ace Your Next Interview with our
            <br />
            <GradientText className="text-5xl md:text-7xl">
              AI Voice Mock Interview
            </GradientText>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Practice with a free AI interview bot that provides realistic voice-based mock interviews. Get AI-generated interview answers, personalized feedback, and refine your responses in real time.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              variant={"silver"}
              onClick={() => router.push("/login?callbackUrl=/home/ai-interview")}
            >
              <Video className="w-6 h-6 mr-2" />
              Start Interview Practice
            </Button>
            <Link href='/login?callbackUrl=/home/ai-interview'>
              <Button
                size="lg"
                variant="outline">
                Learn More About AI Interview bot
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
      </div>

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
              "AI Interview Questions for Any Role",
              "Detailed Feedback and Insights",
              "Practice Interview AI Chatbot Support",
              "Ideal for Structured Interview Preparation",
            ]}
            action={() =>
              router.push("/login?callbackUrl=/home/ai-interview")
            }
          />
          <TypeCard
            icon={<Workflow className="w-6 h-6" />}
            title="Adaptive Interview"
            description="Dynamic questions that adjust based on your responses. Experience a more realistic and challenging interview flow."
            features={[
              "Real-Time Question Adaptation",
              "Simulates Real-World Interview Flow",
              "Helps You Think on Your Feet",
              "Challenging and Engaging Practice",
            ]}
            action={() => router.push("/login?callbackUrl=/home/ai-interview")}
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
      <section className="container mx-auto px-4 py-20">
        <FAQAccordion faqData={faqData} />
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
          variant={"silver"}
          onClick={() => router.push("/login?callbackUrl=/home/ai-interview")}
        >
          Begin Your Practice Interview
        </Button>
      </section>
    </div>
  );
}

export default InterviewPage;