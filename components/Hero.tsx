"use client";
import { useState, useEffect } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { submitEmail } from "@/actions/sendMail";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Joining...
        </>
      ) : (
        "Join Waitlist"
      )}
    </Button>
  );
}

export function Hero() {
  const [email, setEmail] = useState("");
  const [userIp, setUserIp] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the user's IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setUserIp(data.ip));
  }, []);

  async function handleSubmit(formData: FormData) {
    formData.append("ip", userIp);
    const result = await submitEmail(formData);
    if (result.success) {
      setEmail("");
      toast({
        title: "Joined waitlist successfully",
        description: result.message,
      });
    } else {
      toast({
        title: "Unable to join waitlist",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen w-full rounded-md relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <motion.h1
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-700 to-zinc-500 dark:from-zinc-200 dark:to-zinc-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Resume, Elevated.
        </motion.h1>
        <motion.p
          className="text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto my-2 text-sm sm:text-lg text-center relative z-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Craft a standout resume with ease using the power of AI. Receive
          tailored suggestions, optimize your content for specific job roles,
          and ensure your resume perfectly aligns with job descriptions—designed
          to accelerate your path to landing your dream job.
        </motion.p>
        <motion.form
          action={handleSubmit}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-64 input"
            required
          />
          <SubmitButton />
        </motion.form>
      </div>
      <Suspense fallback="loading...">
        <BackgroundBeams/>
      </Suspense>
    </div>
  );
}