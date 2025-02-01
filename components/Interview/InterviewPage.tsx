"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewSetup from "@/components/Interview/interview-setup";
import { PremiumModal } from "@/components/premium-modal";
import { RecentResume } from "@/types/types";
import { useSearchParams } from "next/navigation";

interface HomeProps {
  recentResumes: RecentResume[];
}

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default function Interview({ recentResumes }: HomeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const modalParam = searchParams.get("modal");
  const featureName = searchParams.get("featureName") || "Feature";
  const credits = Number(searchParams.get("credits")) || 0;
  const [isOpen, setIsOpen] = useState(modalParam === "true");

  useEffect(() => {
    setIsOpen(modalParam === "true");
  }, [modalParam]);

  const onClose = () => {
    setIsOpen(false);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("modal");
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <>
      <InterviewSetup recentResumes={recentResumes} />
      <PremiumModal
        credits={credits}
        name={`${capitalize(featureName)} Interview`}
        open={isOpen}
        onClose={onClose}
      />
    </>
  );
}
