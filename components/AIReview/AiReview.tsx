"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract, { createWorker, PSM } from "tesseract.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Loader2,
  Loader,
  X,
  Save,
  CheckCircle,
} from "lucide-react";
import axios, { CancelTokenSource } from "axios";
import {
  ResumeData,
  ResumeStyles,
  RecentResume as UserResume,
} from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { creditList } from "@/utils/credits";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateCredits } from "@/slices/userAssets";
import { PremiumModal } from "../premium-modal";
import { Badge } from "../ui/badge";
import jp from "jsonpath";
import { ScrollArea } from "../ui/scroll-area";
import { saveResumeData } from "@/actions/saveResumeData";
import ResumeDisplay from "../resumeViewer";
import { initialState } from "@/slices/rightsidebarSlice";

type Issue = {
  name: string;
  severity: string;
};

type Metric = {
  type: string;
  score: number;
  issues: Issue[];
};

type AIReviewResult = {
  selector: string;
  metrics: Metric[];
  correction_logic: string;
  final_output: string;
};

function getProperty(obj: any, selector: string): any {
  try {
    const result = jp.query(obj, `$.${selector}`);
    return result.length === 1 ? result[0] : result;
  } catch (error) {
    console.error("Invalid selector:", selector, error);
    return undefined;
  }
}

function processMetrics(suggestions: AIReviewResult[]) {
  if (!suggestions || !suggestions.length) return null;

  const totalIssues = suggestions.reduce((count, suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return count;
    return (
      count +
      suggestion.metrics.reduce((metricCount, metric) => {
        return metricCount + metric.issues.length;
      }, 0)
    );
  }, 0);

  // Count issues by type
  const issuesByType: Record<string, number> = {};
  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      if (!issuesByType[metric.type]) {
        issuesByType[metric.type] = 0;
      }
      issuesByType[metric.type] += metric.issues.length;
    });
  });

  // Find most common issue type
  let mostCommonIssueType = "";
  let mostCommonIssueCount = 0;

  Object.entries(issuesByType).forEach(([type, count]) => {
    if (count > mostCommonIssueCount) {
      mostCommonIssueType = type;
      mostCommonIssueCount = count;
    }
  });

  // Calculate average score across all metrics
  let totalScore = 0;
  let scoreCount = 0;

  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      totalScore += metric.score;
      scoreCount++;
    });
  });

  const averageScore =
    scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

  // Count issues by severity
  const issuesBySeverity: Record<string, number> = {
    minor: 0,
    moderate: 0,
    major: 0,
  };

  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      metric.issues.forEach((issue) => {
        if (issuesBySeverity[issue.severity] !== undefined) {
          issuesBySeverity[issue.severity]++;
        }
      });
    });
  });

  return {
    totalIssues,
    issuesByType,
    mostCommonIssueType,
    mostCommonIssueCount,
    averageScore,
    issuesBySeverity,
  };
}

function groupIssuesBySection(suggestions: AIReviewResult[]) {
  if (!suggestions || !suggestions.length) return {};

  const groupedIssues: Record<string, AIReviewResult[]> = {};

  suggestions.forEach((suggestion) => {
    // Extract the major section from the selector
    let majorSection = suggestion.selector;

    // Find the first occurrence of [, (, or . and use everything before it
    const bracketIndex = majorSection.indexOf("[");
    const parenthesisIndex = majorSection.indexOf("(");
    const dotIndex = majorSection.indexOf(".");

    let cutIndex = majorSection.length;
    if (bracketIndex > -1) cutIndex = Math.min(cutIndex, bracketIndex);
    if (parenthesisIndex > -1) cutIndex = Math.min(cutIndex, parenthesisIndex);
    if (dotIndex > -1) cutIndex = Math.min(cutIndex, dotIndex);

    majorSection = majorSection.substring(0, cutIndex);

    if (!groupedIssues[majorSection]) {
      groupedIssues[majorSection] = [];
    }

    groupedIssues[majorSection].push(suggestion);
  });

  return groupedIssues;
}

export default function AIReview({
  recentResumes,
}: {
  recentResumes: UserResume[];
}) {
  const searchParams = useSearchParams();
  const [reviewType, setReviewType] = useState(
    searchParams.get("reviewType") ?? "generic"
  );
  const [resumeOption, setResumeOption] = useState<"select" | "upload">(
    "select"
  );
  const loading = useAppSelector((state) => state?.assets?.loading);
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");

  console.log(selectedResume);

  console.log();

  const text = `[
    {
      "selector": "projects[0].summary",
      "metrics": [
        {
          "type": "Grammar",
          "score": 4,
          "issues": [
            {
              "name": "Run-on sentence: Break up the long sentence into two shorter, clearer sentences.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Improved sentence structure and clarity by breaking the long sentence into two shorter sentences.",
      "final_output": "This sample campaign demonstrates the inner workings of a successful marketing strategy.  Its effectiveness is tested in the real world with actual prospects."
    },
    {
      "selector": "projects[1].summary",
      "metrics": [
        {
          "type": "Grammar",
          "score": 4,
          "issues": [
            {
              "name": "Run-on sentence: Break up the long sentence into two shorter, clearer sentences.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Improved sentence structure and clarity by breaking the long sentence into two shorter sentences.",
      "final_output": "This sample campaign demonstrates the inner workings of a successful marketing strategy.  Its effectiveness is tested in the real world with actual prospects."
    },
    {
      "selector": "awards[?(@.id=='90876543-2109-8765-4321-0fedcba98765')].title",
      "metrics": [
        {
          "type": "Grammar",
          "score": 3,
          "issues": [
            {
              "name": "Improper use of comma: The comma after 'ever' is misplaced and creates an awkward phrasing.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Corrected the misplaced comma and improved the phrasing for clarity.",
      "final_output": "One of the best employees ever, 2020"
    },
    {
      "selector": "summary[0].content",
      "metrics": [
        {
          "type": "Conciseness & Clarity",
          "score": 4,
          "issues": [
            {
              "name": "Wordy sentence: 'Results-oriented marketing professional with 10 years of experience driving brand growth and ROI through digital marketing, brand strategy, and multichannel campaign management.' Could be: 'Results-oriented marketing professional with 10 years of experience driving brand growth and ROI through digital marketing and multichannel campaigns.'",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Simplified wordy sentences.",
      "final_output": "<p>Results-oriented marketing professional with 10 years of experience driving brand growth and ROI through digital marketing and multichannel campaigns. Proven ability to lead cross-functional teams, leveraging data-driven insights for strategic decision-making. Seeking a challenging role to contribute to a company's continued success.</p>"
    },
    {
      "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
      "metrics": [
        {
          "type": "Readability",
          "score": 5,
          "issues": []
        }
      ],
      "correction_logic": "No changes needed",
      "final_output": "<ul><li><p>Designed email marketing campaigns that achieved a 35% increase in open rates and a 20% boost in click-through rates.</p></li><li><p>Supported the implementation of SEO strategies that elevated website ranking from page 5 to page 1 on Google. </p></li><li><p>Coordinated events and trade shows, driving attendee engagement and generating over $200,000 in sales leads. </p></li><li><p>Conducted customer surveys and focus groups to gather insights that shaped marketing strategies.</p></li></ul>"
    },
    {
      "selector": "experience[?(@.id=='b4a39281-7654-3210-fedcba98-76543210')].summary",
      "metrics": [
        {
          "type": "Readability",
          "score": 5,
          "issues": []
        }
      ],
      "correction_logic": "No changes needed",
      "final_output": "<ul><li><p>Directed digital advertising efforts across Google Ads, Facebook, and LinkedIn, driving a 25% increase in lead generation.</p></li><li><p>Orchestrated content marketing initiatives that boosted website traffic by 60% in 2 years.</p></li><li><p>Developed and maintained brand guidelines to ensure consistency across all customer touchpoints.</p></li><li><p>Collaborated with the product team to successfully launch 5 new products, achieving an average market penetration of 15% within the first year.</p></li><li><p>Conducted regular competitor analyses to refine positioning and maintain market competitiveness.</p></li></ul>"
    },
    {
      "selector": "experience[?(@.id=='a3b2c1d0-6543-2109-8765-43210fedcba98')].summary",
      "metrics": [
        {
          "type": "Readability",
          "score": 5,
          "issues": []
        }
      ],
      "correction_logic": "No changes needed",
      "final_output": "<ul><li><p>Spearheaded the company’s transition to digital-first marketing, increasing online sales by 45% within 18 months. </p></li><li><p>Designed and executed multi-channel marketing campaigns that resulted in a 30% growth in customer acquisition.</p></li><li><p>Analysed market trends to identify new opportunities, leading to the launch of 3 successful product lines. </p></li><li><p>Managed a $2M annual marketing budget, achieving a 20% improvement in ROI year-over-year.</p></li><li><p>Built and led a team of 12 marketing professionals, fostering a collaborative and innovative work environment.</p></li></ul>"
    },
    {
      "selector": "awards[?(@.id=='90876543-2109-8765-4321-0fedcba98765')].summary",
      "metrics": [
        {
          "type": "Conciseness & Clarity",
          "score": 4,
          "issues": [
            {
              "name": "Wordy phrase: 'Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%' could be: 'Increased seasonal sales by 50% with a new holiday campaign'",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Improved conciseness and clarity.",
      "final_output": "Increased seasonal sales by 50% with a new holiday campaign"
    },
    {
      "selector": "projects[?(@.id=='f9b30528-406d-4019-afe4-c749ce10bfe7')]",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 3,
          "issues": [
            {
              "name": "Duplicate project entry. Project with id 'f9b30528-406d-4019-afe4-c749ce10bfe7' is a duplicate of project with id '38ed886f-7cbb-4119-ace4-c8a6a5764449'.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Removed duplicate project entry.",
      "final_output": null
    },
    {
      "selector": "awards",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 1,
          "issues": [
            {
              "name": "Duplicate award summary: 'Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%' is repeated in multiple awards.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Removed duplicate award summaries and retained unique award entries.",
      "final_output": "[{\\"id\\":\\"90876543-2109-8765-4321-0fedcba98765\\",\\"date\\":\\"2022\\",\\"title\\":\\"One of the employees ever,2020\\",\\"awarder\\":\\"Brightwave Global\\",\\"summary\\":\\"Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%\\"},{\\"id\\":\\"78654321-0987-6543-2109-876543210fed\\",\\"date\\":\\"2017\\",\\"title\\":\\"Employee of the Year, 2017\\",\\"awarder\\":\\"Spark Innovations\\",\\"summary\\":\\"Achieved Employee of the Year for outstanding contributions to marketing and sales growth.\\"}]"
    },
    {
      "selector": "publications",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 3,
          "issues": [
            {
              "name": "Duplicate publication entry: Publications with ids '4a2b770a-572d-4aed-b727-78828b7f540e' and 'c0cbf110-b0d3-4cdb-9808-0502a1acb288' have identical names and publishers.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Removed duplicate publication entry.",
      "final_output": "[{\\"id\\":\\"4a2b770a-572d-4aed-b727-78828b7f540e\\",\\"url\\":{\\"href\\":\\"\\",\\"label\\":\\"\\"},\\"date\\":\\"2025-02-05T18:30:00.000Z\\",\\"name\\":\\"Tester with a mechanical heart\\",\\"publisher\\":\\"IEEE\\",\\"publishedIn\\":\\"IEEE\\"}]"
    },
    {
      "selector": "references",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 1,
          "issues": [
            {
              "name": "Duplicate reference entry: Two entries exist for Jane Smith with identical contact information.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Removed duplicate reference entry.",
      "final_output": "[{\\"id\\":\\"34210987-6543-2109-8765-43210fedcba98\\",\\"name\\":\\"Jane Smith\\",\\"email\\":\\"janesmith@gmail.com\\",\\"phone\\":\\"(123) 12312312\\"}]"
    },
    {
      "selector": "volunteer",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 1,
          "issues": [
            {
              "name": "Duplicate volunteer entry: Two entries for Brightwave Global with overlapping dates and locations.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Removed the duplicate volunteer entry.",
      "final_output": "[{\\"id\\":\\"43801067-bd47-43e6-87c9-363609d256f2\\",\\"role\\":\\"tester\\",\\"endDate\\":\\"2025-02-12T18:30:00.000Z\\",\\"location\\":\\"new york\\",\\"startDate\\":\\"2025-02-04T18:30:00.000Z\\",\\"organization\\":\\"Brightwave Global\\"}]"
    },
    {
      "selector": "awards[?(@.id=='89765432-1098-7654-3210-fedcba987654')].summary",
      "metrics": [
        {
          "type": "Repetition",
          "score": 1,
          "issues": [
            {
              "name": "This achievement is repeated across multiple awards.  Consider consolidating or rephrasing for variety.",
              "severity": "minor"
            }
          ]
        },
        {
          "type": "Conciseness & Clarity",
          "score": 4,
          "issues": [
            {
              "name": "Wordy phrase: 'Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%' could be: 'Increased seasonal sales by 50% with a new holiday campaign'",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Combined both changes. The concise and clear sentence adds valuable quantitative data, complementing the initial recognition statement.",
      "final_output": "Recognized for exceptional leadership and innovative marketing strategies that significantly impacted company growth. Increased seasonal sales by 50% with a new holiday campaign."
    },
    {
      "selector": "awards[?(@.id=='78654321-0987-6543-2109-876543210fed')].summary",
      "metrics": [
        {
          "type": "Repetition",
          "score": 1,
          "issues": [
            {
              "name": "This achievement is repeated across multiple awards.  Consider consolidating or rephrasing for variety.",
              "severity": "minor"
            }
          ]
        },
        {
          "type": "Conciseness & Clarity",
          "score": 4,
          "issues": [
            {
              "name": "Wordy phrase: 'Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%' could be: 'Increased seasonal sales by 50% with a new holiday campaign'",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Combined both changes. The concise and clear sentence adds valuable quantitative data, complementing the initial recognition statement.",
      "final_output": "Awarded for outstanding contributions to the team and exceeding expectations in driving impactful results. Increased seasonal sales by 50% with a new holiday campaign."
    }
  ]`;
  const parsed = JSON.parse(text);
  const [aiSuggestions, setAiSuggestions] = useState<AIReviewResult[] | null>(
    parsed
  );

  console.log(aiSuggestions);
  type DataItem = {
    selector: string;
    final_output: string;
  };

  function extractFinalOutput(data: DataItem[]): DataItem[] {
    return data.map(({ selector, final_output }) => ({
      selector,
      final_output,
    }));
  }
  const testresume = `
  {
  "basics": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "url": {
        "href": "jonathandoesmith.com",
        "label": "jonathandoesmith.com"
      },
      "name": "Jonathan Doesmith",
      "email": "jonathan.doesmith@example.com",
      "phone": "(123) 456-7890",
      "picture": null,
      "headLine": "Marketing Specialist",
      "location": "Newark, US"
    }
  ],
  "summary": [
    {
      "content": "<p>Results-oriented marketing professional with 10 years of experience driving brand growth and ROI through digital marketing, brand strategy, and multichannel campaign management.  Proven ability to lead cross-functional teams, leveraging data-driven insights for strategic decision-making.  Seeking a challenging role where I can leverage my expertise to contribute to a company's continued success.</p>"
    }
  ],
  "profiles": [
    {
      "id": "f0e9d8c7-b6a5-4321-9876-543210fedcba",
      "url": {
        "href": "linkedin.com",
        "label": "Linkedin"
      }
    },
    {
      "id": "86ebf850-205c-44a9-a3bf-151a141f25df",
      "url": {
        "href": "github.com",
        "label": "Github"
      }
    },
    {
      "id": "3cdc7a4c-bfc4-4c16-99ee-c5045435956e",
      "url": {
        "href": "x.xom",
        "label": "X"
      }
    }
  ],
  "skills": [
    {
      "id": "e7f8d9c0-a4b5-6789-0123-456789abcdef",
      "name": "Marketing",
      "skills": [
        {
          \"name\": \"HubSpot\",
          \"level\": \"Beginner\"
        },
        {
          \"name\": \"Marketo\",
          \"level\": \"Intermediate\"
        },
        {
          \"name\": \"Salesforce\",
          \"level\": \"Beginner\"
        }
      ]
    },
    {
      "id": "1739259823138",
      "name": "Analytics Tools",
      "skills": [
        {
          \"name\": \"Google Analytics\",
          \"level\": \"Advanced\"
        },
        {
          \"name\": \"Tableau\",
          \"level\": \"Intermediate\"
        },
        {
          \"name\": \"SEMrush\",
          \"level\": \"Intermediate\"
        }
      ]
    },
    {
      "id": "1739259867730",
      "name": "Design Tools",
      "skills": [
        {
          \"name\": \"Adobe Creative Cloud\",
          \"level\": \"Beginner\"
        },
        {
          \"name\": \"Canva\",
          \"level\": \"Advanced\"
        }
      ]
    },
    {
      "id": "1739259882713",
      "name": "Programming & Automation",
      "skills": [
        {
          \"name\": \"HTML\",
          \"level\": \"Beginner\"
        },
        {
          \"name\": \"CSS\",
          \"level\": \"Advanced\"
        },
        {
          \"name\": \"Zapier\",
          \"level\": \"Intermediate\"
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "38ed886f-7cbb-4119-ace4-c8a6a5764449",
      "url": {
        "href": "github.com",
        "label": "view project"
      },
      "name": "Test Campaign",
      "endDate": "Present",
      "summary": "This sample campaign shows us the inner working of a successful marketing campaign and test its effectiveness in the real world with real prospects.",
      "keywords": [
        "campaign",
        "marketing",
        "digital marketing",
        "testing"
      ],
      "startDate": "2025-01-20T18:30:00.000Z"
    },
    {
      "id": "f9b30528-406d-4019-afe4-c749ce10bfe7",
      "url": {
        "href": "linkedin.com",
        "label": "view project"
      },
      "name": "Test Campaign",
      "endDate": "2025-02-26T18:30:00.000Z",
      "summary": "This sample campaign shows us the inner working of a successful marketing campaign and test its effectiveness in the real world with real prospects.",
      "keywords": [
        "campaign",
        "marketing",
        "digital marketing",
        "testing"
      ],
      "startDate": "2025-02-20T18:30:00.000Z"
    }
  ],
  "education": [
    {
      "id": "d6c5b4a3-9281-5764-039e-dcba09876543",
      "field": "Business Administration",
      "score": "8.82",
      "degree": "Bachelor's",
      "endDate": "2013-02-27T18:30:00.000Z",
      "startDate": "2010-02-27T18:30:00.000Z",
      "institution": "University of California, Berkeley",
      "specialization": "Marketing"
    }
  ],
  "experience": [
    {
      "id": "c5d4a3b2-8190-7654-3210-fedcba987654",
      "role": "Marketing Specialist",
      "endDate": "May 2014",
      "summary": "<ul><li><p>Designed email marketing campaigns that achieved a 35% increase in open rates and a 20% boost in click-through rates.</p></li><li><p>Supported the implementation of SEO strategies that elevated website ranking from page 5 to page 1 on Google. </p></li><li><p>Coordinated events and trade shows, driving attendee engagement and generating over $200,000 in sales leads. </p></li><li><p>Conducted customer surveys and focus groups to gather insights that shaped marketing strategies.</p></li></ul>",
      "location": "San Francisco, CA",
      "startDate": "2012-08-31T18:30:00.000Z",
      "organization": "Visionary Ventures"
    },
    {
      "id": "b4a39281-7654-3210-fedcba98-76543210",
      "role": "Senior Marketing Manager",
      "endDate": "Apr 2018",
      "summary": "<ul><li><p>Directed digital advertising efforts across Google Ads, Facebook, and LinkedIn, driving a 25% increase in lead generation.</p></li><li><p>Orchestrated content marketing initiatives that boosted website traffic by 60% in 2 years.</p></li><li><p>Developed and maintained brand guidelines to ensure consistency across all customer touchpoints.</p></li><li><p>Collaborated with the product team to successfully launch 5 new products, achieving an average market penetration of 15% within the first year.</p></li><li><p>Conducted regular competitor analyses to refine positioning and maintain market competitiveness.</p></li></ul>",
      "location": "Chicago, IL",
      "startDate": "Jun 2014",
      "organization": "Spark Innovations"
    },
    {
      "id": "a3b2c1d0-6543-2109-8765-43210fedcba98",
      "role": "Marketing Director",
      "endDate": "2025-02-13T18:30:00.000Z",
      "summary": "<ul><li><p>Spearheaded the company's transition to digital-first marketing, increasing online sales by 45% within 18 months. </p></li><li><p>Designed and executed multi-channel marketing campaigns that resulted in a 30% growth in customer acquisition.</p></li><li><p>Analysed market trends to identify new opportunities, leading to the launch of 3 successful product lines. </p></li><li><p>Managed a $2M annual marketing budget, achieving a 20% improvement in ROI year-over-year.</p></li><li><p>Built and led a team of 12 marketing professionals, fostering a collaborative and innovative work environment.</p></li></ul>",
      "location": "New York, NY",
      "startDate": "May 2018",
      "organization": "Brightwave Global"
    }
  ],
  "languages": [
    {
      "id": "abadd7a9-a083-41dc-8a0d-429f6684d4ee",
      "name": "English",
      "level": "Native"
    },
    {
      "id": "e36b2630-f607-40f6-8aca-313a01b77cdc",
      "name": "Mandarin",
      "level": "Advanced"
    },
    {
      "id": "54fe8362-1b9e-4891-823a-6c691de383d1",
      "name": "Cantonene",
      "level": "Intermediate"
    }
  ],
  "volunteer": [
    {
      "id": "43801067-bd47-43e6-87c9-363609d256f2",
      "role": "tester",
      "endDate": "2025-02-12T18:30:00.000Z",
      "location": "new york",
      "startDate": "2025-02-04T18:30:00.000Z",
      "organization": "Brightwave Global"
    },
    {
      "id": "74f91a01-24c9-43e3-9b45-13ea93505f45",
      "role": "Brightwave Global",
      "endDate": "2025-02-12T18:30:00.000Z",
      "location": "Brightwave Global",
      "startDate": "2025-02-26T18:30:00.000Z",
      "organization": "Brightwave Global"
    }
  ],
  "awards": [
    {
      "id": "90876543-2109-8765-4321-0fedcba98765",
      "date": "2022",
      "title": "One of the employees ever,2020",
      "awarder": "Brightwave Global",
      "summary": "Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%"
    },
    {
      "id": "89765432-1098-7654-3210-fedcba987654",
      "date": "2020",
      "title": "EPLED Marketing Leaders, 2020",
      "awarder": "A Marketing World Conference",
      "summary": "Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%"
    },
    {
      "id": "78654321-0987-6543-2109-876543210fed",
      "date": "2017",
      "title": "Employee of the Year, 2017",
      "awarder": "Spark Innovations",
      "summary": "Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%"
    }
  ],
  "publications": [
    {
      "id": "4a2b770a-572d-4aed-b727-78828b7f540e",
      "url": {
        "href": "",
        "label": ""
      },
      "date": "2025-02-05T18:30:00.000Z",
      "name": "Tester with a mechanical heart",
      "publisher": "IEEE",
      "publishedIn": "IEEE"
    },
    {
      "id": "c0cbf110-b0d3-4cdb-9808-0502a1acb288",
      "url": {
        "href": "https://ieee.com",
        "label": "IEEE"
      },
      "date": "2025-02-12T18:30:00.000Z",
      "name": "Tester with a mechanical heart",
      "publisher": "IEEE",
      "publishedIn": "IEEE"
    }
  ],
  "certifications": [
    {
      "id": "67543210-9876-5432-1098-76543210fedcb",
      "url": {
        "href": "https://google.com",
        "label": "Google Garage"
      },
      "date": "2023",
      "name": "Google Analytics Certification",
      "issuer": "Google Garage"
    },
    {
      "id": "56432109-8765-4321-0987-6543210fedcba",
      "url": {
        "href": "https://google.com",
        "label": "Hubspot"
      },
      "date": "2022",
      "name": "HubSpot Content Marketing Certification",
      "issuer": "Hubspot"
    },
    {
      "id": "45321098-7654-3210-fedcba98-7654321",
      "url": {
        "href": "https://google.com",
        "label": "Google Garage"
      },
      "date": "2021",
      "name": "Certified Digital Marketing Professional (CDMP)",
      "issuer": "Digital Marketing Institute"
    }
  ],
  "references": [
    {
      "id": "34210987-6543-2109-8765-43210fedcba98",
      "name": "Jane Smith",
      "email": "janesmith@gmail.com",
      "phone": "(123) 12312312"
    },
    {
      "id": "bd426f9e-fbbe-42b9-bd27-9d623dddc442",
      "name": "Jane Smith",
      "email": "janesmith@gmail.com",
      "phone": "(123) 12312312"
    }
  ],
  "custom": {
    "createdOn": "2025-02-12T11:07:23.556Z",
    "updatedOn": "2025-03-06T09:50:39.526Z"
  },
  "styles": null,
  "createdOn": null,
  "updatedOn": null
}`;
  const testparseresume = JSON.parse(testresume);
  const [resumeData, setResumeData] = useState(testparseresume);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userResumes, setUserResumes] = useState<UserResume[]>();
  const [resuLoading, setresuLoading] = useState<boolean>(false);
  const [funcdisabler, setFuncDisabler] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const dispatch = useAppDispatch();
  const credits = useAppSelector((state) => state?.assets?.credits);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);
  const [resumeStyles, setResumeStyles] = useState<ResumeStyles>(initialState);

  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const sentences = [
    "Analyzing your resume",
    "Checking for grammar issues",
    "Evaluating readability",
    "Assessing content repetition",
    "Reviewing overall structure",
    "Building change list",
  ];

  function extractSelectorAndOutput(jsonText: string) {
    try {
      const data = JSON.parse(jsonText);
      return data.map((item: any) => ({
        selector: item.selector,
        final_output: item.final_output,
      }));
    } catch (error) {
      console.error("Invalid JSON format", error);
      return [];
    }
  }

  const handleAcceptAllAndSave = async () => {
    //@ts-ignore
    const data = extractFinalOutput(aiSuggestions);
    console.log(data);

    setResumeData((prevData: ResumeData) => {
      const updatedData = JSON.parse(JSON.stringify(prevData));

      data.forEach(({ selector, final_output }) => {
        let parsedOutput: any = final_output;
        try {
          parsedOutput = JSON.parse(final_output);
        } catch (e) {}

        try {
          jp.value(updatedData, selector, parsedOutput);
        } catch (error) {
          console.error("Invalid JSONPath selector:", selector, error);
          toast({
            title: "Error",
            description:
              "Something went wrong while updating. Please try again.",
            variant: "destructive",
          });
        }
      });

      (async () => {
        await handleSave({ value: updatedData });
      })();
      // 🔥 Call handleSave with the updated data


      return updatedData;
    });

    setAiSuggestions([]);
  };

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentSentenceIndex(
          (prevIndex) => (prevIndex + 1) % sentences.length
        );
      }, 5000); // Change sentence every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const onClose = () => {
    setOpen(false);
  };

  const metrics = aiSuggestions ? processMetrics(aiSuggestions) : null;

  // Group issues by major section
  const groupedIssues = aiSuggestions
    ? groupIssuesBySection(aiSuggestions)
    : {};

  const { toast } = useToast();
  useEffect(() => {
    async function worker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress);
            //console.log(message.progress === 1 ? "Done" : message.status);
          }
        },
      });
    }
    worker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    setUserResumes(recentResumes);
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setIsOcrInProgress(true);
    setOcrProgress(0);

    const worker = workerRef.current;
    await worker?.load();
    await worker?.loadLanguage("eng");
    await worker?.initialize("eng");
    await worker?.setParameters({
      tessjs_create_hocr: "1",
      tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
    });

    let ocrText = "";

    if (uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      const pdfUrl = URL.createObjectURL(uploadedFile);
      const imageUrls = await pdfToImages(pdfUrl);
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await worker?.recognize(imageUrls[i]);
        ocrText += " " + response?.data.text;
      }
      setIsUploadDialogOpen(false);
      setResumeOption("upload");
    }

    setResumeText(ocrText);
    //console.log(ocrText);
    setIsOcrInProgress(false);
    setOcrProgress(1);
  };

  const handleResumeSelect = (value: string) => {
    if (!resuLoading || funcdisabler) {
      //console.log("Now you called master!!");
      setSelectedResume(value);
      setResumeOption("select");
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (credits < (creditList.get(reviewType) ?? 0)) {
      setOpen(true);
      return;
    }
    setIsLoading(true);
    setAiSuggestions(null);
    setShowResultsDialog(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      //console.log(reviewType);
      const response = await axios.post(
        `/api/get-resume-review`,
        {
          resumeId: selectedResume,
          resumeOption,
          resumeText,
          jd: jd,
          reviewType: reviewType,
        },
        {
          cancelToken: source.token,
        }
      );
      setResumeData(response?.data?.resume);
      setResumeStyles(response?.data?.styles);
      if (response?.data?.statusCode === 402) {
        return toast({
          variant: "destructive", // Set the toast type to error
          description:
            response?.data.message || "Insufficient credits to proceed.", // Use the message from the API
          title: "Insufficient credits",
        });
      }
      // console.log("here!!!!",response.data.review.finalStageResults)

      if (!response.data.output.finalStageResults) {
        toast({
          title: `Error ${response.status}`,
          description: response.data.message,
          variant: "destructive",
        });
      }
      // console.log("output:", response.data.output.finalStageResults)
      setJd("");
      setAiSuggestions(response.data.output.finalStageResults);
      dispatch(
        updateCredits(
          credits -
            ((reviewType === "tailored"
              ? creditList.get("tailored")
              : creditList.get("generic")) ?? 0)
        )
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteIssue = (selector: string) => {
    if (!aiSuggestions) return;

    const updatedSuggestions = aiSuggestions.filter(
      (suggestion) => suggestion.selector !== selector
    );

    setAiSuggestions(updatedSuggestions);
    console.log(`Deleted issue with selector: ${selector}`);
  };

  const handleSave = async (
    { value }: { value?: any } = { value: undefined }
  ) => {
    console.log("Saved");
    try {
      //console.log(resumeStyles);
      console.log(
        "Attempting to save resume data...",
        resumeData,
        selectedResume
      );
      let data = value ? value : resumeData;
      const res = await saveResumeData(
        data,
        undefined,
        selectedResume,
        "reviewupdate"
      );
      console.log("saveResumeData function:", saveResumeData);

      console.log("Response received:", res);
      if (res.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      //console.log("Reusme Update suceess");
      toast({
        title: "Success",
        description: "Resume updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the resume.",
        variant: "destructive",
      });
    }
  };

  function updateResumeData(selector: string, finalOutput: string) {
    setResumeData((prevData: ResumeData) => {
      // Deep copy to prevent mutation issues
      const updatedData = JSON.parse(JSON.stringify(prevData));

      // Try to parse finalOutput if it's valid JSON
      let parsedOutput: any = finalOutput;
      try {
        parsedOutput = JSON.parse(finalOutput);
      } catch (e) {
        // If parsing fails, it means finalOutput is already a string or primitive, so leave it as is
      }

      // Ensure selector is a valid JSONPath
      try {
        jp.value(updatedData, selector, parsedOutput);
      } catch (error) {
        console.error("Invalid JSONPath selector:", selector, error);
        toast({
          title: "Error",
          description: "Something went wrong while updating. Please try again.",
          variant: "destructive",
        });

        return prevData; // Return previous data if JSONPath fails
      }

      return updatedData;
    });
  }

  console.log(resumeData);

  const handleAcceptIssue = (selector: string, finalOutput: string) => {
    if (!aiSuggestions) return;

    const updatedSuggestions = aiSuggestions.filter(
      (suggestion) => suggestion.selector !== selector
    );

    setAiSuggestions(updatedSuggestions);
    updateResumeData(selector, finalOutput);
    toast({
      title: "Success",
      description: "Changes have been queued. Please save.",
    });

    // console.log(
    //   `Accepted issue with selector: ${selector}, final output: ${finalOutput}`
    // );
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <motion.main
        className="flex-1 overflow-auto p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">AI Resume Review</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="resume-option">Resume Option</Label>
              <RadioGroup
                id="resume-option"
                value={resumeOption}
                onValueChange={(value: "select" | "upload") =>
                  setResumeOption(value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="select" id="select-resume" />
                  <Label htmlFor="select-resume">Select Existing Resume</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload-resume" />
                  <Label htmlFor="upload-resume">Upload New Resume</Label>
                </div>
              </RadioGroup>
            </div>
            {resumeOption === "select" ? (
              <div>
                <Label htmlFor="resume-select">Select Resume</Label>
                <Select
                  value={selectedResume}
                  onValueChange={handleResumeSelect}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resuLoading ? (
                      <SelectItem
                        value={"null"}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                      </SelectItem>
                    ) : userResumes?.length === 0 ? (
                      <SelectItem value="noresumes">
                        No resumes found
                      </SelectItem>
                    ) : (
                      userResumes?.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.resumeName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="resume-upload">Upload Your Resume</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="flex-1"
                    disabled={resumeOption !== "upload" || isOcrInProgress}
                  />
                  <Dialog
                    open={isUploadDialogOpen}
                    onOpenChange={setIsUploadDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={resumeOption !== "upload" || isOcrInProgress}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className="text-lg font-semibold mb-4">
                        Upload Resume
                      </h2>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="w-full"
                        disabled={isOcrInProgress}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    File uploaded: {file.name}
                  </p>
                )}
                {isOcrInProgress && (
                  <div className="mt-4">
                    <Label>Extracting data from PDF...</Label>
                    <Progress value={ocrProgress * 100} className="mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {(ocrProgress * 100).toFixed(0)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="review-type">Review Type</Label>
              <RadioGroup
                id="review-type"
                value={reviewType}
                onValueChange={setReviewType}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generic" id="generic" />
                  <Label htmlFor="generic">Generic Review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tailored" id="tailored" />
                  <Label htmlFor="tailored">Tailored Review</Label>
                </div>
              </RadioGroup>
            </div>
            {reviewType === "tailored" && (
              <div>
                <Label htmlFor="jd">Job Description</Label>
                <Textarea
                  id="jd"
                  placeholder="Paste the job description here for tailored suggestions..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isOcrInProgress}
              >
                {isLoading ? (
                  <div className="flex">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  "Start Resume Review"
                )}
              </Button>
            )}
          </form>
        </div>
      </motion.main>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
          >
            <div className="flex flex-col justify-between items-center p-4 bg-card rounded-md shadow-md border min-w-96 min-h-44">
              <motion.div
                key={currentSentenceIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="mt-10"
              >
                <p className="font-medium">{sentences[currentSentenceIndex]}</p>
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (cancelTokenSource) {
                    cancelTokenSource.cancel("Request canceled by the user.");
                  }
                  setIsLoading(false);
                  setShowResultsDialog(false);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <textarea name="" id="" value={JSON.stringify("Asd",null,2)}></textarea> */}
      <AnimatePresence>
        {showResultsDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background"
          >
            <div className="flex h-full flex-col">
              {/* Header with exit and save buttons */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResultsDialog(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Exit
                </Button>
                <h2 className="text-xl font-bold">Resume Analysis Results</h2>
                <div className="flex items-center gap-x-2">
                  <Button
                    onClick={handleAcceptAllAndSave}
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Accept All & Save
                  </Button>
                  <Button
                    onClick={() => handleSave()}
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Metrics row */}
              {metrics && (
                <div className="border-b bg-muted/30 p-4">
                  <div className="mx-auto max-w-7xl">
                    <h3 className="mb-4 text-lg font-semibold">
                      Resume Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Issues
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {metrics.totalIssues}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Average Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {metrics.averageScore}/10
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Most Common Issue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-bold">
                            {metrics.mostCommonIssueType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {metrics.mostCommonIssueCount} issues
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Issues by Severity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {metrics.issuesBySeverity.major > 0 && (
                              <Badge variant="destructive">
                                {metrics.issuesBySeverity.major} Major
                              </Badge>
                            )}
                            {metrics.issuesBySeverity.moderate > 0 && (
                              <Badge variant="default">
                                {metrics.issuesBySeverity.moderate} Moderate
                              </Badge>
                            )}
                            {metrics.issuesBySeverity.minor > 0 && (
                              <Badge variant="secondary">
                                {metrics.issuesBySeverity.minor} Minor
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Two-column layout */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left column - Issues */}
                <div className="w-full md:w-1/2 overflow-auto border-r">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <h3 className="mb-4 text-lg font-semibold">Issues</h3>

                      {Object.entries(groupedIssues).map(
                        ([section, issues]) => (
                          <Accordion
                            type="single"
                            collapsible
                            key={section}
                            className="mb-4"
                          >
                            <AccordionItem value={section}>
                              <AccordionTrigger className="px-4 py-2 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">
                                    {section}
                                  </span>
                                  <Badge variant="outline" className="ml-2">
                                    {issues.length}{" "}
                                    {issues.length === 1 ? "issue" : "issues"}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2">
                                {issues.map((issue, index) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    key={index}
                                    className="mb-2"
                                  >
                                    <AccordionItem
                                      value={`${section}-${index}`}
                                      className="border rounded-md overflow-hidden"
                                    >
                                      <AccordionTrigger className="px-4 py-2 hover:bg-muted/30">
                                        <div className="flex items-center justify-between w-full">
                                          <span className="font-medium text-sm">
                                            {issue.selector}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="ml-2"
                                          >
                                            {issue.metrics.reduce(
                                              (count, metric) =>
                                                count + metric.issues.length,
                                              0
                                            )}{" "}
                                            issues
                                          </Badge>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="bg-muted/10 p-4">
                                        <div className="space-y-4">
                                          {issue.metrics.map(
                                            (metric, metricIndex) => (
                                              <div
                                                key={metricIndex}
                                                className="space-y-2"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <h4 className="font-medium">
                                                    {metric.type}
                                                  </h4>
                                                  <div className="flex items-center gap-2">
                                                    <Progress
                                                      value={metric.score * 10}
                                                      className="w-24"
                                                    />
                                                    <span className="text-sm">
                                                      {metric.score}/10
                                                    </span>
                                                  </div>
                                                </div>

                                                {metric.issues.length > 0 && (
                                                  <div className="space-y-2">
                                                    {metric.issues.map(
                                                      (
                                                        issueItem,
                                                        issueIndex
                                                      ) => (
                                                        <div
                                                          key={issueIndex}
                                                          className="rounded-md bg-muted/30 p-2"
                                                        >
                                                          <div className="flex items-start justify-between">
                                                            <div>
                                                              <p className="text-sm">
                                                                {issueItem.name}
                                                              </p>
                                                              <Badge
                                                                variant={
                                                                  issueItem.severity ===
                                                                  "major"
                                                                    ? "destructive"
                                                                    : issueItem.severity ===
                                                                      "moderate"
                                                                    ? "default"
                                                                    : "secondary"
                                                                }
                                                                className="mt-1"
                                                              >
                                                                {
                                                                  issueItem.severity
                                                                }
                                                              </Badge>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}

                                                <div className="pt-2">
                                                  <h5 className="text-sm font-medium">
                                                    Original:
                                                  </h5>
                                                  <div className="mt-1 rounded-md bg-muted/20 p-2 text-sm">
                                                    {resumeData
                                                      ? JSON.stringify(
                                                          getProperty(
                                                            resumeData,
                                                            issue.selector
                                                          )
                                                        )
                                                      : "Loading..."}
                                                  </div>
                                                </div>

                                                <div className="pt-2">
                                                  <h5 className="text-sm font-medium">
                                                    Suggested:
                                                  </h5>
                                                  <div className="mt-1 rounded-md bg-muted/20 p-2 text-sm">
                                                    {JSON.stringify(
                                                      issue.final_output,
                                                      null,
                                                      2
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleDeleteIssue(
                                                        issue.selector
                                                      )
                                                    }
                                                  >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Delete
                                                  </Button>
                                                  <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleAcceptIssue(
                                                        issue.selector,
                                                        issue.final_output
                                                      )
                                                    }
                                                  >
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Accept
                                                  </Button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )
                      )}

                      {Object.keys(groupedIssues).length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h4 className="text-lg font-medium">
                            No issues found
                          </h4>
                          <p className="text-muted-foreground">
                            Your resume looks great!
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right column - Resume preview (placeholder) */}
                <div className="hidden md:block md:w-1/2 overflow-auto bg-muted/10">
                  <div className="flex h-full items-center justify-center p-4">
                    <ResumeDisplay
                      resumeData={resumeData}
                      resumeStyle={resumeStyles}
                      templateNumber={resumeStyles.id}
                      key={resumeStyles.id}
                    />
                    {/* <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">
                        Resume Preview
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This area would display a preview of your resume
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PremiumModal
        credits={
          reviewType === "generic"
            ? creditList.get("generic") ?? 0
            : creditList.get("tailored") ?? 0
        }
        name={reviewType === "generic" ? "Generic Review" : "Tailored Review"}
        onClose={onClose}
        open={open}
      />
    </div>
  );
}
