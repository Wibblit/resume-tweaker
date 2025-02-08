"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserData } from "@/actions/getUserData";
import { useSession } from "next-auth/react";

const DataExport = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const handleJSONExport = async () => {
    try {
      const { resumes, coverLetters } = await getUserData();
      console.log("resumes:", resumes); // Already an array
      console.log("coverLetters:", coverLetters); // Already an array
  
      const exportData = {
        resumes: resumes, // No need to parse, already an array
        coverLetters: coverLetters, // No need to parse, already an array
        profileInfo: session?.user
          ? (({ expires, ...rest }) => rest)(session.user)
          : null,
        exportDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
  
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume-data-${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleCSVExport = async () => {
    try {
      const { resumes, coverLetters } = await getUserData();

      // Convert resumes and cover letters to CSV format
      const csvRows = [];

      // Add export date
      csvRows.push(
        [
          "Export Date",
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          "",
          "",
          "", // Empty cells to match column count
        ].join(",")
      );

      // Add headers
      csvRows.push(
        ["Type", "ID", "Name", "Created Date", "Updated Date"].join(",")
      );

      // Add profile data if available
      if (session?.user) {
        const { expires, ...profileData } = session.user;
        csvRows.push(
          [
            "Profile",
            profileData.id || "N/A",
            profileData.name || "N/A",
            new Date(profileData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).replace(/\//g, "-") || "N/A", // No creation date for profile
            "N/A", // No update date for profile
          ].join(",")
        );
      }

      // Add resume data
      resumes.forEach((resume: any) => {
        csvRows.push(
          [
            "Resume",
            resume.id,
            resume.resumeName,
            new Date(resume.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            new Date(resume.updatedOn).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          ].join(",")
        );
      });

      // Add cover letter data
      coverLetters.forEach((letter: any) => {
        csvRows.push(
          [
            "Cover Letter",
            letter.id,
            letter.coverName,
            new Date(letter.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            new Date(letter.updatedOn).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          ].join(",")
        );
      });

      // Create and download CSV file
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume-data-${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your data has been exported as CSV",
      });
    } catch (error) {
      console.error("CSV export failed:", error);
      toast({
        title: "Export failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Export Your Data</h4>
      <p className="text-sm text-muted-foreground">
        Download your resumes and cover letters in different formats
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleJSONExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export as JSON
        </Button>
        <Button
          variant="outline"
          onClick={handleCSVExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export as CSV
        </Button>
      </div>
    </div>
  );
};

export default DataExport;