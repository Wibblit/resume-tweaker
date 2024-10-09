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
  pageFormat: "a4" | "letter";
}

const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const CoverTemplate1: React.FC<CoverLetterTemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageFormat,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UpdateBaseColor(baseColor || "#57534e"));
  }, [dispatch, baseColor]);

  const pageDimensions = PAGE_FORMATS[pageFormat];

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: `${margin}mm`,
      position: "relative",
      backgroundColor: "#fff",
      height: `${pageDimensions.height}mm`, // Set height based on page format
      width: `${pageDimensions.width}mm`, // Set width based on page format
      boxSizing: "border-box", // Ensure padding is included in total height
    },
    section: {
      marginBottom: "1em",
    },
    heading: {
      fontSize: "2em",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "0.5em",
      marginTop: "1em",
    },
    topBar: {
      backgroundColor: baseColor,
      height: "20px",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
    bottomBar: {
      backgroundColor: baseColor,
      height: "20px",
      width: "100%",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

  return (
    <div className="cover-letter" style={styles.container}>
      {/* Top Background Bar */}
      <div style={styles.topBar}></div>

      <style>
        {`
          .cover-letter * {
            font-family: inherit;
          }
          .cover-letter p {
            color: black;
            font-size: ${1.3 * fontSize}px;
            line-height: ${1.6 * fontSize}px;
            white-space: pre-wrap; 
            word-wrap: break-word; 
            overflow-wrap: break-word;
            text-align: justify;
          }
        `}
      </style>
      <div style={styles.section}>
        <p style={styles.heading}>{content.subject}</p>
      </div>
      {/* Cover Letter Content */}
      <div style={{ padding: `${margin}mm`, position: "relative", zIndex: 1 }}>
        <div style={styles.section}>
          <p>{content.date}</p>
        </div>

        <div style={styles.section}>
          <p style={{ textAlign: "right" }}>{content.recipientInfo}</p>
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

        <div style={styles.section}>
          <p style={{ textAlign: "left" }}>{content.signOff}</p>
        </div>
      </div>

      {/* Bottom Background Bar */}
      <div style={styles.bottomBar}></div>
    </div>
  );
};

export default CoverTemplate1;
