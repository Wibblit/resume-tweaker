'use client'
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/gradient-text";
import {
  FileText,
  Cpu,
  LineChart,
  Upload,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { ProcessStep } from "@/components/ReviewPage/ProcessStep";
import ReviewResults from "@/components/ReviewPage/ReviewResult";
import Link from "next/link";

import { TypeCard } from "@/components/ReviewPage/TypeCard";
import { useRouter } from "next/navigation";

const dummyData = {
  evaluation: [
    {
      category: "Content Quality",
      score: 8.5,
      comment:
        "Strong achievement-focused bullet points with quantifiable results.",
    },
    {
      category: "ATS Compatibility",
      score: 9.0,
      comment:
        "Excellent use of industry-standard keywords and clear formatting.",
    },
    {
      category: "Structure & Format",
      score: 7.5,
      comment: "Good organization, but section spacing could be improved.",
    },
    {
      category: "Impact Statements",
      score: 8.0,
      comment: "Strong action verbs and clear outcome descriptions.",
    },
    {
      category: "Professional Presentation",
      score: 9.5,
      comment: "Consistent formatting and professional language throughout.",
    },
  ],
  overall_score: 8.5,
  final_recommendation: "Resume Ready for Submission",
  overall_comment:
    "Your resume effectively showcases your professional experience and achievements.",
};

const processSteps = [
  {
    title: "Upload Your Resume",
    description:
      "Select from your saved resumes or upload a new one. Supports PDF and Word formats.",
    icon: <Upload className="w-6 h-6" />,
    video: "/videos/review-video-1.mp4",
  },
  {
    title: "AI Processing",
    description:
      "Our advanced AI analyzes your resume for content, format, and effectiveness.",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    title: "Detailed Results",
    description:
      "Get comprehensive feedback with actionable improvements and scoring.",
    icon: <LineChart className="w-6 h-6" />,
    video: "/videos/review-video-2.mp4",
  },
];

export default function ReviewPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,white_95%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,white_95%,transparent)]">
<div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#000,transparent)] -z-10"/>
      <section className="container max-w-7xl mx-auto px-4 pt-20 pb-32 mt-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Optimize Your Resume with
          <br />
          <GradientText className="text-5xl md:text-7xl">
            AI-Powered Review
          </GradientText>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get instant, professional feedback on your resume with advanced AI
          analysis. Perfect your resume for your dream job.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login?callbackUrl=/ai-review">
            {" "}
            <Button
              size="lg"
              variant={"silver"}
            >
              <FileText className="w-6 h-6 mr-2" />
              Review My Resume
            </Button>
          </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const reviewTypesSection =
                  document.getElementById("review-types");
                  reviewTypesSection?.scrollIntoView({ behavior: "smooth" });
                }}
                >
              Learn More
            </Button>
        </div>
      </section>

      {/* Review Types Section */}
      <section
        id="review-types"
        className="container mx-auto max-w-7xl px-4 py-20"
        >
        <h2 className="text-3xl font-bold text-center mb-12">
          <GradientText>Choose Your Review Type</GradientText>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <TypeCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Generic Review"
            description="Comprehensive analysis of your resume's structure, content, and impact. Perfect for overall resume improvement."
            features={[
              "ATS Compatibility Check",
              "Content Quality Analysis",
              "Format Optimization",
              "Language Enhancement",
              "Basic Improvement Suggestions",
            ]}
            action={() => router.push("/login?callbackUrl=/ai-review")}
            />
          <TypeCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Tailored Review"
            description="Job-specific analysis comparing your resume against the target role. Upload a job description for customized feedback."
            features={[
              "Keyword Alignment Analysis",
              "Skills Gap Identification",
              "Job-Specific Recommendations",
              "Qualification Matching",
              "Targeted Improvement Plan",
            ]}
            action={() => router.push("/login?callbackUrl=/ai-review")}
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
          </div>

      {/* Sample Results Section */}
      <section className="mx-auto px-4 py-20 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-24">
          <GradientText>Comprehensive Analysis</GradientText>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">We Analyze:</h3>
            <div className="space-y-4">
              {[
                "Content Quality & Impact",
                "ATS Compatibility",
                "Structure & Formatting",
                "Professional Language",
                "Achievement Highlights",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto w-full">
            <ReviewResults isStatic={true} data={dummyData} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <GradientText>Ready to Optimize Your Resume?</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get instant feedback and improve your chances of landing your dream
          job.
        </p>
        <Link href={'/login?callbackUrl=/ai-review'}>
          <Button
            size="lg"
            variant={"silver"}
            // onClick={() => router.push("/ai-review")}
          >
            Start Resume Review
          </Button>
        </Link>
      </section>
    </div>
  );
}


