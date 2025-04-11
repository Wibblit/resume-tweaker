"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import LetterItem from "./LetterItem";
import { CreateNewCoverButton } from "./CreateNewButton";
import { useEffect, useState } from "react";
import { CreateNewDialog } from "./CreateNewDialog";
import { useToast } from "@/hooks/use-toast";
import { LetterProps } from "@/types/types";
import {
  FileText,
  Crown,
  Sparkles,
  Loader,
  CreditCard,
  Plus,
} from "lucide-react";

const COVER = "Cover Letter";
export default function LetterContent({
  searchQuery,
  letters,
}: {
  searchQuery: string;
  letters: LetterProps;
}) {
  const [recentCoverLetters, setRecentCoverLetters] = useState<LetterProps>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const loading = useAppSelector((state) => state?.assets?.loading);
  const coverslot = useAppSelector((state) => state?.assets?.coverslot);
  const usedcoverslot = useAppSelector(
    (state) => state?.assets?.usedcoverletters
  );
  const avaiLableCredits = useAppSelector((state) => state.assets.credits);

  const availableSlots = coverslot - usedcoverslot;

  useEffect(() => {
    setRecentCoverLetters(letters);
  }, [letters]);

  const handleBuyCredits = () => {
    router.push("/pricing");
  };

  const letterTemplates = [
    {
      id: 1,
      name: "Classic Professional",
      image: "https://cdnresumetweaker.wibblit.com/static-images/sample1-coverletter.webp",
    },
    { id: 2, name: "Modern Header", image: "https://cdnresumetweaker.wibblit.com/static-images/sample2-coverletter.webp" },
    { id: 3, name: "Classic Framed", image: "https://cdnresumetweaker.wibblit.com/static-images/sample3-coverletter.webp" },
    { id: 4, name: "Bold Sidebar", image: "https://cdnresumetweaker.wibblit.com/static-images/sample4-coverletter.webp" },
    { id: 5, name: "Minimalist Centered", image: "https://cdnresumetweaker.wibblit.com/static-images/sample5-coverletter.webp" },
  ];

  const filteredTemplates = letterTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Status Card */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center flex-wrap gap-y-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl shadow-sm backdrop-blur-sm">
                <Crown className="text-primary w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-card-foreground">
                  Wibblit's Cover Letter Creator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create compelling cover letters in minutes
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-start gap-2">
                <div className="flex items-center gap-1 bg-secondary/50 px-4 py-2 rounded-md shadow-sm text-sm w-full md:min-w-[160px] justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-secondary-foreground">
                    {usedcoverslot} / {coverslot} slots
                  </span>
                </div>

                <Button
                  onClick={handleBuyCredits}
                  className="bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1 px-4 py-2 rounded-md shadow-sm text-sm w-full md:min-w-[160px] justify-center"
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">Buy</span>
                  <Plus className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1 bg-amber-900/20 px-4 py-2 rounded-md shadow-sm text-sm w-full md:min-w-[160px] justify-center">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-700">
                    {avaiLableCredits} Credits
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Cover Letters */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Recent Cover Letters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-[120px] w-full rounded-xl" />
              ))}
            </>
          ) : (
            <>
              {recentCoverLetters?.map((letter) => (
                <LetterItem
                  setRecentCoverLetters={
                    setRecentCoverLetters! as React.Dispatch<
                      React.SetStateAction<LetterProps>
                    >
                  }
                  key={letter.id}
                  letter={letter}
                />
              ))}
              <CreateNewCoverButton />
            </>
          )}
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          Cover Letter Templates
        </h2>
        {filteredTemplates.length === 0 ? (
          <div className="bg-card/50 rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              No matching templates found.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <CreateNewDialog
                key={template.id}
                type={COVER}
                template={true}
                templateId={template.id}
              >
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 group"
                >
                  <div className="relative aspect-[3/4] w-full mb-2 overflow-hidden rounded-md">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover:bg-background/20 transition-colors" />
                  </div>
                  <span className="font-medium">{template.name}</span>
                </Button>
              </CreateNewDialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
