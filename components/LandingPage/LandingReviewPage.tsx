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
import FAQAccordion from "../faq-accordian";

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

const faqData = [
  {
    question: "Is it worth paying for a resume review?",
    answer: "Investing in a professional resume review can significantly enhance your job application by ensuring your resume is polished, ATS-friendly, and tailored to specific roles, thereby increasing your chances of securing interviews."
  },
  {
    question: "What is the best AI for resume review?",
    answer: "ResumeTweaker offers an AI-powered resume review service that provides instant, detailed feedback, helping you optimize your resume's content, format, and alignment with job descriptions."
  },
  {
    question: "Is ResumeTweaker's resume review worth it?",
    answer: "Yes, ResumeTweaker's AI-driven resume review service offers comprehensive analysis, including ATS compatibility checks, content quality assessments, and personalized improvement suggestions, making it a valuable tool for job seekers aiming to enhance their resumes."
  },
  {
    question: "How does ResumeTweaker compare to other resume review services?",
    answer: "ResumeTweaker stands out by combining advanced AI technology with user-friendly features, offering instant feedback and a variety of professional templates, making it a competitive choice among resume review services."
  },
  {
    question: "What makes a resume ATS-friendly?",
    answer: "An ATS-friendly resume uses a clean, straightforward format with standard section headings, keyword optimization based on job descriptions, and avoids elements like tables, graphics, or fancy fonts that may confuse applicant tracking systems (ATS). ResumeTweaker automatically checks and adjusts your resume to be ATS-compatible."
  },
  {
    question: "How often should I update my resume?",
    answer: "It's a good idea to update your resume every six months or whenever you gain new skills, complete significant projects, or take on new responsibilities. Regular updates ensure your resume is ready for new opportunities at any time. ResumeTweaker can make updating your resume quick and easy with real-time suggestions."
  },
  {
    question: "What should I include in a cover letter?",
    answer: "A strong cover letter should include a personalized introduction, a brief explanation of why you’re a good fit for the role, specific examples of your achievements, and a compelling closing statement. ResumeTweaker's AI can help you craft a tailored, impactful cover letter in minutes."
  },
  {
    question: "Can AI really help me get a job?",
    answer: "Yes! AI tools like ResumeTweaker help job seekers by optimizing resumes for ATS systems, suggesting impactful content, and tailoring documents to specific roles. While AI can't replace personalized effort, it can dramatically improve your chances of landing interviews by ensuring your application materials are polished and aligned with industry standards."
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

export default function ReviewPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <div className="bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,white_95%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,white_95%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#000,transparent)] -z-10" />
        <section className="container max-w-7xl mx-auto px-4 pt-20 pb-32 mt-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Optimize Your Resume with the Best
            <br />
            <GradientText className="text-5xl md:text-7xl">
              AI ATS Resume Checker
            </GradientText>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Instantly improve your resume with our online resume checker. Get a detailed ATS resume score and actionable tips to stand out.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/login?callbackUrl=/home/ai-review">
              {" "}
              <Button
                size="lg"
                variant={"silver"}
              >
                <FileText className="w-6 h-6 mr-2" />
                Start ATS Resume Review
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
              Learn More About Resume Scores
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
              title="Generic ATS Resume Review"
              description="Get a ATS resume score with detailed feedback on content, structure, and keywords to improve your job application success."
              features={[
                "ATS Compatibility Check",
                "Resume Content Quality Analysis",
                "Format & Layout Optimization",
                "Language & Grammar Enhancement",
                "Basic Improvement Suggestions",
              ]}
              action={() => router.push("/login?callbackUrl=/home/ai-review")}
            />
            <TypeCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Tailored Job-Specific Review"
              description="Upload a job description to get an AI-powered resume review tailored to your target role. Ideal for keyword alignment and skill matching."
              features={[
                "Keyword Optimization for ATS",
                "Skills Gap Identification",
                "Job-Specific Recommendations",
                "Qualification Matching",
                "Targeted Resume Improvement Plan",
              ]}
              action={() => router.push("/login?callbackUrl=/home/ai-review")}
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
              {["Resume Content Quality & Impact", 
              "ATS Compatibility Score", 
              "Structure & Formatting for ATS",
               "Professional Language & Clarity", 
               "Achievement & Metric Highlights"].map((item) => (
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
      <section className="container mx-auto px-4 py-20">
        <FAQAccordion faqData={faqData} />
      </section>
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          <GradientText>Ready to Boost Your Resume Score?</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Use our ATS resume checker to get instant feedback and increase your chances of landing your dream job.
        </p>
        <Link href={'/login?callbackUrl=/home/ai-review'}>
          <Button
            size="lg"
            variant={"silver"}
          // onClick={() => router.push("/home/ai-review")}
          >
            Start AI Resume Review
          </Button>
        </Link>
      </section>
    </div>
  );
}


