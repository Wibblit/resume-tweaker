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
  pageFormat: string;
}

export default function CoverTemplate3({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageFormat
}: CoverLetterTemplateProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="cover-letter"
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        padding: `${margin}mm`,
      }}
    >
      <style>{`
        .cover-letter * {
          font-family: inherit;
        }
        .cover-letter  {
          color: black;
          font-size: ${fontSize}px;
          line-height: ${1.5 * fontSize}px;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
          p{
          // color: black;
          font-size: ${fontSize}px;
          line-height: ${1.5 * fontSize}px;
          }
      `}</style>
      <div className=" p-6 mb-6" style={{ backgroundColor: baseColor }}>
        <h1 className="text-3xl font-bold text-center text-white">
          {content.subject}
        </h1>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between">
          <p>{content.date}</p>
          <p>{content.recipientInfo}</p>
        </div>
        <p className="font-semibold">{content.salutation}</p>
        <HTMLViewer lineHeight={lineHeight} content={content.opening} />
        <HTMLViewer
          lineHeight={lineHeight}
          content={content.interestInPosition}
        />
        <HTMLViewer
          lineHeight={lineHeight}
          content={content.professionalSummary}
        />
        <HTMLViewer lineHeight={lineHeight} content={content.keyAchievements} />
        <HTMLViewer lineHeight={lineHeight} content={content.culturalFit} />
        <HTMLViewer lineHeight={lineHeight} content={content.closing} />
        <p className="mt-6">{content.signOff}</p>
      </div>
    </div>
  );
}
