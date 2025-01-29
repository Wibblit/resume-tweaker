// import InterviewSetup from "@/components/Interview/interview-setup";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { PremiumModal } from "@/components/premium-modal";

// interface Home {
//   searchParams: {
//     modal: boolean;
//     featureName: string;
//     credits: number;
//   };
// }

// const capitalize = (str: string) =>
//   str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// export default async function Home({ searchParams }: Home) {
//   const session = await auth();
//   if (!session?.user) return redirect("/login?callbackUrl=/ai-interview");

//   const onClose = () => {
//     if (searchParams.modal) {
//       searchParams.modal = false
//     }
//   }

//   return (
//     <>
//       <InterviewSetup />
//       <PremiumModal
//         credits={searchParams.credits}
//         name={`${capitalize(searchParams.featureName || "Feature")} Interview`}
//         open={searchParams.modal}
//         onClose={onClose}
//       />
//     </>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewSetup from "@/components/Interview/interview-setup";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PremiumModal } from "@/components/premium-modal";

interface HomeProps {
  searchParams: {
    modal?: string;
    featureName?: string;
    credits?: string;
  };
}

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default function Home({ searchParams }: HomeProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(searchParams.modal === "true");

  useEffect(() => {
    setIsOpen(searchParams.modal === "true");
  }, [searchParams.modal]);

  const onClose = () => {
    setIsOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    router.replace(url.toString());
  };

  return (
    <>
      <InterviewSetup />
      <PremiumModal
        credits={Number(searchParams.credits) || 0}
        name={`${capitalize(searchParams.featureName || "Feature")} Interview`}
        open={isOpen}
        onClose={onClose}
      />
    </>
  );
}
