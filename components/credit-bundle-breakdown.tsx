"use client";

import { motion } from "framer-motion";
import { Users, FileText, Bot, Brain, CheckCircle2, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const bundles = [
  {
    credits: 200,
    features: {
      adaptiveInterviews: 2,
      comprehensiveInterviews: 2,
      resumeReviews: 2,
      aiFeatures: 100,
    },
    highlight: false,
  },
  {
    credits: 400,
    features: {
      adaptiveInterviews: 4,
      comprehensiveInterviews: 4,
      resumeReviews: 4,
      aiFeatures: 120,
    },
    highlight: true,
  },
  {
    credits: 1000,
    features: {
      adaptiveInterviews: 10,
      comprehensiveInterviews: 10,
      resumeReviews: 10,
      aiFeatures: 200,
    },
    highlight: false,
  },
  {
    credits: 2000,
    features: {
      adaptiveInterviews: 20,
      comprehensiveInterviews: 16,
      resumeReviews: 20,
      aiFeatures: 160,
    },
    highlight: false,
  },
];

const FeatureCard = ({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: any;
  title: string;
  value: number;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start space-x-4 p-4 rounded-lg bg-card"
  >
    <div className="p-2 rounded-full bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <div className="flex items-start space-x-2 justify-between">
        <h4 className="font-semibold">{title}</h4>
        <Badge variant="secondary">{value}x</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

export function PricingBreakdown() {
  return (
    <div className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">What You Get With Each Bundle</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our credit bundles are designed to give you flexibility. Use your
          credits across different features based on your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bundles.map((bundle) => (
          <motion.div
            key={bundle.credits}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card
              className={bundle.highlight ? "border-primary shadow-lg" : ""}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{bundle.credits} Credits</CardTitle>
                  {bundle.highlight && (
                    <Badge variant="default">Most Popular</Badge>
                  )}
                </div>
                <CardDescription>Suggested usage breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureCard
                  icon={Brain}
                  title="Adaptive AI Interviews"
                  value={bundle.features.adaptiveInterviews}
                  description="Dynamic interviews that adapt to your responses"
                />
                <FeatureCard
                  icon={Users}
                  title="Comprehensive Interviews"
                  value={bundle.features.comprehensiveInterviews}
                  description="In-depth technical interviews"
                />
                <FeatureCard
                  icon={FileText}
                  title="Resume Reviews"
                  value={bundle.features.resumeReviews}
                  description="Detailed AI-powered resume analysis"
                />
                <FeatureCard
                  icon={Bot}
                  title="AI Features Usage"
                  value={bundle.features.aiFeatures}
                  description="For resume and cover letter enhancement"
                />
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
                    Flexible credit usage across features
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-primary" />
            Important Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a suggested breakdown of how you might use your credits. You
            have the flexibility to use your credits however you prefer across
            our features. For example, if you need more resume reviews and fewer
            interviews, you can adjust your usage accordingly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
