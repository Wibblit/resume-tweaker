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
import { LetterProps } from "@/types/types";

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

  useEffect(() => {
    setRecentCoverLetters(letters);
  }, []);

  const letterTemplates = [
    {
      id: 1,
      name: "Classic Professional",
      image: "/templates/ctemplate1.avif",
    },
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
