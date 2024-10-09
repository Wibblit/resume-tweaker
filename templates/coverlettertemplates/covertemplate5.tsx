"use client";

import React, { useEffect } from "react";
import { CoverLetterState } from "@/types/types";
import { useAppDispatch } from "@/hooks/hooks";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import HTMLViewer from "@/components/HTMLViewer";

interface CoverLetterTemplateProps {
  content: CoverLetterState;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

export default function Component({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}: CoverLetterTemplateProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UpdateBaseColor(baseColor));
  }, [dispatch]);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: `${margin}mm`,
      maxWidth: "210mm", // A4 width
      margin: "0 auto",
      backgroundColor: "#fff",
    },
    section: {
      marginBottom: "1em",
    },
    header: {
      marginBottom: "2em",
    },
    footer: {
      marginTop: "2em",
    },
    subject: {
      fontSize: `${1.5 * fontSize}px`, // Increase the font size for the subject
      fontWeight: "bold",
      textAlign: "center", // Center the subject text
      marginBottom: "1em", // Add some space below the subject
      color : baseColor
    },
  };

  return (
    <div className="cover-letter" style={styles.container}>
      <style>
        {`
          .cover-letter * {
            font-family: inherit;
          }
          .cover-letter p {
            color: black;
            font-size: ${fontSize}px;
            line-height: ${lineHeight};
            white-space: pre-wrap; 
            word-wrap: break-word; 
            overflow-wrap: break-word;
            text-align: left;
            margin-bottom: 1em;
          }
        `}
      </style>
      <div style={styles.section}>
        <p style={styles.subject}>{content.subject}</p>{" "}
        {/* Updated to use new styles */}
      </div>
      <div style={styles.header}>
        <p>{content.date}</p>
        <p>{content.recipientInfo}</p>
      </div>

      <div style={styles.section}>
        <p>{content.salutation}</p>
      </div>

      <div style={styles.section}>
        <HTMLViewer lineHeight={lineHeight} content={content.opening} />
      </div>

      <div style={styles.section}>
        <HTMLViewer
          lineHeight={lineHeight}
          content={content.interestInPosition}
        />
      </div>

      <div style={styles.section}>
        <HTMLViewer
          lineHeight={lineHeight}
          content={content.professionalSummary}
        />
      </div>

      <div style={styles.section}>
        <HTMLViewer lineHeight={lineHeight} content={content.keyAchievements} />
      </div>

      <div style={styles.section}>
        <HTMLViewer lineHeight={lineHeight} content={content.culturalFit} />
      </div>

      <div style={styles.section}>
        <HTMLViewer lineHeight={lineHeight} content={content.closing} />
      </div>

      <div style={styles.footer}>
        <p>{content.signOff}</p>
      </div>
    </div>
  );
}
