"use client";

import { useAppDispatch } from "@/hooks/hooks";
import { UpdateId } from "@/slices/rightsidebarSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import LetterItem from "./LetterItem";
import { CreateNewCoverButton } from "./CreateNewButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateNewDialog } from "./CreateNewDialog";
import { useToast } from "@/hooks/use-toast";

const COVER = "Cover Letter";

interface RecentCoverLetter {
  id: string;
  userId: string;
  coverName: string;
}

export default function LetterContent({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [recentCoverLetters, setRecentCoverLetters] =
    useState<RecentCoverLetter[]>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    async function getRecentCoverLetters() {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          recentCoverLetters: RecentCoverLetter[];
          message: string;
        }>("/api/get-recent-cover-letter/");
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        console.log(response, "recent cover letters");
        setRecentCoverLetters(response.data.recentCoverLetters);
      } catch (error) {
        console.error("Error fetching recent cover letters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getRecentCoverLetters();
  }, []);

  const letterTemplates = [
    { id: 1, name: "Classic Professional", image: "/templates/ctemplate1.avif" },
    { id: 2, name: "Modern Header", image: "/templates/ctemplate2.avif" },
    { id: 3, name: "Blue Framed", image: "/templates/ctemplate3.avif" },
    { id: 4, name: "Bold Sidebar", image: "/templates/ctemplate4.avif" },
    { id: 5, name: "Minimalist Centered", image: "/templates/ctemplate5.avif" },
  ];

  const filteredTemplates = letterTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Recently Edited Cover Letters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-[120px] w-full rounded-md" />
              ))}
            </>
          ) : (
            <>
              {recentCoverLetters?.map((letter) => (
                <LetterItem
                  setRecentCoverLetters={setRecentCoverLetters}
                  key={letter.id}
                  letter={letter}
                />
              ))}
              <CreateNewCoverButton />
            </>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Cover Letter Templates</h2>
        {filteredTemplates.length === 0 ? (
          <p className="text-muted-foreground">No matching templates found.</p>
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
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover:bg-background/20 transition-colors" />
                  </div>
                  <span className="font-medium">{template.name}</span>
                </Button>
              </CreateNewDialog>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
