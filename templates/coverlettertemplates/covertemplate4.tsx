"use client";

import React from "react";
import { CoverLetterState } from "@/types/types";
import { useAppDispatch } from "@/hooks/hooks";
import { useEffect } from "react";
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
  }, [dispatch, baseColor]);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      display: "flex",
      height: "100%",
      minHeight: "297mm", // A4 height
      width: "210mm", // A4 width
    },
    sidebar: {
      width: "30%",
      backgroundColor: baseColor,
      color: "#fff",
      padding: `${margin}mm`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    main: {
      width: "70%",
      padding: `${margin}mm`,
      display: "flex",
      flexDirection: "column",
    },
    subject: {
      fontSize: "2em",
      fontWeight: "bold",
      marginBottom: "1em",
      color: baseColor,
    },
    heading: {
      fontSize: "1.2em",
      fontWeight: "bold",
      marginBottom: "0.5em",
    },
    section: {
      marginBottom: "1em",
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
            color: inherit;
            font-size: ${fontSize}px;
            line-height: ${lineHeight};
            white-space: pre-wrap; 
            word-wrap: break-word; 
            overflow-wrap: break-word;
          }
        `}
      </style>
      <div style={styles.sidebar}>
        <div>
          <p style={{ fontSize: "1.2em", marginBottom: "0.5em" }}>
            {content.date}
          </p>
          <p style={{ marginBottom: "1em" }}>{content.recipientInfo}</p>
        </div>
        <div>
          <p>{content.signOff}</p>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.subject}>{content.subject}</h1>
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
          <HTMLViewer
            lineHeight={lineHeight}
            content={content.keyAchievements}
          />
        </div>
        <div style={styles.section}>
          <HTMLViewer lineHeight={lineHeight} content={content.culturalFit} />
        </div>
        <div style={styles.section}>
          <HTMLViewer lineHeight={lineHeight} content={content.closing} />
        </div>
      </div>
    </div>
  );
}
