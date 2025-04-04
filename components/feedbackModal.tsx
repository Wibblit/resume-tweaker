"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Changed from Checkbox
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";

const feedbackFormSchema = z.object({
  feedbackType: z.enum(["General Feedback", "Feature Suggestion", "Bug Report"]),
  feedbackContent: z.string().min(10, "Feedback must be at least 10 characters"),
  followup: z.boolean().default(true) // Default changed to true
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      followup: true, // Default set to true
    },
  });

  async function onSubmit(data: FeedbackFormValues) {
    if (!session?.user?.name || !session?.user?.email) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          name: session.user.name,
          email: session.user.email,
          ...data,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feedbackType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of feedback" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General Feedback">General Feedback</SelectItem>
                      <SelectItem value="Feature Suggestion">Feature Suggestion</SelectItem>
                      <SelectItem value="Bug Report">Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedbackContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="followup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Follow-up Contact</FormLabel>
                    <FormDescription>
                      Allow us to contact you about your feedback
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}