"use client";

import { useAppDispatch } from "@/hooks/hooks";
import { UpdateId } from "@/slices/rightsidebarSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import ResumeItem from "./ResumeItem";
import { CreateNewResumeButton } from "./CreateNewButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { CreateNewDialog } from "./CreateNewDialog";

interface RecentResume {
  id: string;
  userId: string;
  resumeName: string;
}

export default function ResumeContent({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    async function getRecentResumes() {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          recentResumes: RecentResume[];
          message: string;
        }>("/api/get-recent-resumes/");
        console.log(response, "recent resumes");
        setRecentResumes(response.data.recentResumes);
      } catch (error) {
        console.error("Error fetching recent resumes:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getRecentResumes();
  }, []);

  const resumeTemplates = [
    { id: 1, name: "Classic Charm", img: "/templates/template1.png" },
    { id: 2, name: "Artistic Flair", img: "/templates/template2.jpg" },
    { id: 3, name: "Executive Edge", img: "/templates/template3.jpg" },
    { id: 4, name: "Fresh Start", img: "/templates/template4.png" },
    { id: 5, name: "Eco Essence", img: "/templates/template5.png" },
  ];

  const filteredTemplates = resumeTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Recently Edited Resumes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-[120px] w-full rounded-md" />
              ))}
            </>
          ) : (
            <>
              {recentResumes?.map((resume) => (
                <ResumeItem  setRecentResumes={setRecentResumes} key={resume.id} resume={resume} />
              ))}
              <CreateNewResumeButton />
            </>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Resume Templates</h2>
        {filteredTemplates.length === 0 ? (
          <p className="text-muted-foreground">No matching templates found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <CreateNewDialog type="Resume" template={true} templateId={template.id}>
                <Button
                  key={template.id}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 group"
                >
                  <div className="relative aspect-[3/4] w-full mb-2 overflow-hidden rounded-md">
                    <Image
                      src={template.img}
                      alt={template.name}
                      fill
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
      </section>
    </div>
  );
}
