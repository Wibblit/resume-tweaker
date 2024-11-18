import { cn } from "@/lib/utils";
import { Feature } from "./FeatureComponent";
import {
  Cpu,
  FileText,
  BarChart2,
  Users,
  Edit,
  Bot,
  DollarSign,
  Clock,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Editor",
      description:
        "Full customization with AI assistance to craft the perfect resume.",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      title: "Pre-built Templates",
      description:
        "Choose from a variety of professional templates to kickstart your resume.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "AI Review and Analysis",
      description:
        "Get instant feedback and suggestions to improve your resume's impact.",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      title: "AI Interview Prep",
      description:
        "Practice interviews tailored to your resume and job description.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Real-time Customization",
      description: "Edit and update your resume with ease in real-time.",
      icon: <Edit className="w-6 h-6" />,
    },
    {
      title: "24/7 AI Assistance",
      description:
        "Get help anytime with our AI-powered resume writing assistant.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Affordable Pricing",
      description:
        "High-quality resume building and AI features at competitive prices.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Time-Saving Solution",
      description: "Create a professional resume in minutes, not hours.",
      icon: <Clock className="w-6 h-6" />,
    },
  ];
  return (
    <>
      <div className="w-full text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl bg-clip-text text-center text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
          Powerful Features for Your Resume
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Craft the perfect resume with our AI-powered tools and features
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </>
  );
}

