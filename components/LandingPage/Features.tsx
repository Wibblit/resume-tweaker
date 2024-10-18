import { cn } from "@/lib/utils";
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

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
