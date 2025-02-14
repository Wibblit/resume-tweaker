"use client";

import React from "react";
import { CoverLetterState } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import HTMLViewer from "@/components/HTMLViewer";
import { formatDate } from "@/utils/formatDate";

interface CoverLetterTemplateProps {
  content: CoverLetterState;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

const CoverTemplate1: React.FC<CoverLetterTemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {
  const dispatch = useAppDispatch();

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: `${margin}mm`,
    },
    section: {
      marginBottom: "1em",
      fontSize: `${fontSize}px`,
    },
    heading: {
      fontSize: "1em",
      fontWeight: "bold",
      marginBottom: "0.5em",
    },
  };

  const datetype = useAppSelector(state => state?.rightsidebar?.datetype)

  return (
    <div className="cover-letter p-8" style={styles.container}>
      <style>
        {`
          .cover-letter * {
            font-family: inherit;
          }
          .cover-letter p {
            // color: black;
            line-height: ${1.6 * fontSize}px;
            white-space: pre-wrap; 
            word-wrap: break-word; 
            overflow-wrap: break-word;
            text-align: justify;
          }
        `}
      </style>

      <div style={styles.section}>
        {content.date && <p>{formatDate(content.date, datetype)}</p>}
      </div>
      
      <div style={styles.section}>
        <p>{content.senderInfo}</p>
      </div>

      <div style={styles.section}>
        <p>{content.recipientInfo}</p>
      </div>

      <div style={styles.section}>
        <p>{content.salutation}</p>
      </div>

      <div style={styles.section}>
        <p style={styles.heading}>{content.subject}</p>
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

      <div style={styles.section}>
        <p>{content.signOff}</p>
      </div>
    </div>
  );
};

export default CoverTemplate1;
