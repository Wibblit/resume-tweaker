"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import ResumeContent from "./ResumeContent";
import LetterContent from "./LetterContent";
import { CreateNewResumeButtonTop } from "./CreateNewButtonTop";
import { CreateNewCoverLetterButtonTop } from "./CreateNewButtonTop";

const RESUME = "resume";
const COVER = "cover";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(RESUME);

  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        className="p-4 md:p-6 h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScrollArea className="h-full">
          <Tabs
            defaultValue="resumes"
            className="h-full"
            onValueChange={(value) =>
              setTab(value === "resumes" ? RESUME : COVER)
            }
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="resumes">Resumes</TabsTrigger>
                <TabsTrigger value="letters">Letters</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                {tab === RESUME ? (
                  <CreateNewResumeButtonTop />
                ) : (
                  <CreateNewCoverLetterButtonTop />
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push("/profile")}
                  className="hidden items-center gap-2 lg:flex"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TabsContent value="resumes" className="mt-4">
              <ResumeContent searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="letters" className="mt-4">
              <LetterContent searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}
