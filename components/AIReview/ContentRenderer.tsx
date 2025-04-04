"use client";

import React, { useEffect, useState } from 'react';
import { formatDate } from '@/utils/formatDate';
import { getPropertyServer } from '@/lib/resumereview/resumeActions';

interface ContentRendererProps {
  content: any;
  className?: string;
  dateFormat?: string;
}

interface AsyncContentRendererProps {
  resumeData: any;
  selector: string;
  className?: string;
  dateFormat?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  className = "",
  dateFormat = "MMM yyyy"
}) => {
  const isHTML = (str: string): boolean => {
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const isJSONString = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  };

  const formatDateValue = (value: any, format: string) => {
    try {
      if (typeof value !== 'string') {
        return String(value);
      }
      return formatDate(value, format);
    } catch {
      return String(value);
    }
  };

  const shouldFormatDate = (key: string, value: any) => {
    const dateFields = ['startDate', 'endDate', 'date'];
    return dateFields.includes(key) && typeof value === 'string';
  };

  const renderObject = (obj: any, depth = 0): JSX.Element => {
    const entries = Object.entries(obj).filter(([key]) => key !== "id");

    return (
      <div className={`space-y-3 ${depth > 0 ? "pl-4 border-l-2 border-muted" : ""}`}>
        {entries.map(([key, value], index) => {
          if (value == null) return null;

          const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

          return (
            <div key={index} className="flex flex-col space-y-1">
              <div className="text-sm text-foreground pl-3">
                <div className="text-sm font-medium text-muted-foreground"><span className="mr-2">{formattedKey}:</span>

                  {typeof value === "object" ? (
                    <div className="p-2 bg-muted/30 rounded-lg">{renderObject(value, depth + 1)}</div>
                  ) : (
                    shouldFormatDate(key, value)
                      ? (typeof value === "object" ? String(value) : formatDateValue(value, dateFormat))
                      : String(value)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderArray = (arr: any[]): JSX.Element => {
    return (
      <div className="space-y-4">
        {arr.map((item, index) => (
          <div key={index} className="relative pl-5 border-l-2 border-primary/40">
            <div className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-primary"></div>
            <div className="p-3 bg-muted/30 rounded-lg">
              {typeof item === "object" ? renderObject(item) : <span className="text-foreground">{String(item)}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  };


  const renderContent = () => {
    if (content == null) {
      return <span className="text-muted-foreground italic">No content</span>;
    }

    if (typeof content === 'object') {
      return Array.isArray(content)
        ? renderArray(content)
        : renderObject(content);
    }

    const stringContent = String(content);

    if (isJSONString(stringContent)) {
      const parsed = JSON.parse(stringContent);
      return Array.isArray(parsed)
        ? renderArray(parsed)
        : renderObject(parsed);
    }

    if (isHTML(stringContent)) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: stringContent }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      );
    }

    return <span className="whitespace-pre-wrap">{stringContent}</span>;
  };

  return (
    <div className={`rounded-md p-2 ${className}`}>
      {renderContent()}
    </div>
  );
};

export const AsyncContentRenderer = ({
  resumeData,
  selector,
  className,
  dateFormat
}: AsyncContentRendererProps) => {
  const [content, setContent] = useState<any>("Loading...");

  useEffect(() => {
    const fetchContent = async () => {
      if (resumeData) {
        const result = await getPropertyServer(resumeData, selector);
        setContent(result);
      }
    };
    fetchContent();
  }, [resumeData, selector]);

  return (
    <ContentRenderer
      content={content}
      className={className}
      dateFormat={dateFormat}
    />
  );
};