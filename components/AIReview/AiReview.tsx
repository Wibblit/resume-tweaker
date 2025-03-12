"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract, { createWorker, PSM } from "tesseract.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
  Upload,
  TrendingUp,
  Loader2,
  Loader,
} from "lucide-react";
import axios from "axios";
import { RecentResume as UserResume } from "@/types/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Label as RechartsLabel,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { creditList } from "@/utils/credits";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateCredits } from "@/slices/userAssets";
import { PremiumModal } from "../premium-modal";
import jp from 'jsonpath';

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

// function RadialChart({
//   data,
//   chartConfig,
// }: {
//   data: AIReviewResult;
//   chartConfig: ChartConfig;
// }) {
//   const chartData = Object.entries(data.criteria).map(([key, value]) => ({
//     name: key,
//     score: value.score,
//   }));

//   const totalScore = chartData.reduce((sum, item) => sum + item.score, 0);
//   const averageScore = totalScore / chartData.length;

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Resume Score Overview</CardTitle>
//         <CardDescription>AI-generated resume evaluation</CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-1 items-center pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square w-full max-w-[250px]"
//         >
//           <RadialBarChart
//             data={chartData}
//             endAngle={180}
//             innerRadius={80}
//             outerRadius={130}
//             barSize={10}
//           >
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//             <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//               <RechartsLabel
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) - 16}
//                           className="fill-foreground text-2xl font-bold"
//                         >
//                           {averageScore.toFixed(1)}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 4}
//                           className="fill-muted-foreground"
//                         >
//                           Average Score
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </PolarRadiusAxis>
//             {chartData.map((entry) => (
//               <RadialBar
//                 key={entry.name}
//                 dataKey="score"
//                 name={entry.name}
//                 data={[entry]}
//                 cornerRadius={5}
//                 fill={`hsl(var(--chart-${
//                   Object.keys(chartConfig).indexOf(entry.name) + 1
//                 }))`}
//                 className="stroke-transparent stroke-2"
//               />
//             ))}
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           {averageScore >= 7 ? "Strong resume" : "Needs improvement"}
//           <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Based on AI analysis of 5 key factors
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

function getProperty(obj: any, selector: string): any {
  try {
    const result = jp.query(obj, `$.${selector}`);
    return result.length === 1 ? result[0] : result;
  } catch (error) {
    console.error("Invalid selector:", selector, error);
    return undefined;
  }
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
      "selector": "volunteer[0]",
      "metrics": [
        {
          "type": "Tone Consistency",
          "score": 3,
          "issues": [
            {
              "name": "Inconsistent information: The role and organization fields are contradictory.  Please clarify and ensure consistency.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Corrected inconsistent information; removed the conflicting role and location to focus on the organization.",
      "final_output": "{ \\"id\\": \\"43801067-bd47-43e6-87c9-363609d256f2\\", \\"organization\\": \\"Brightwave Global\\", \\"endDate\\": \\"2025-02-12T18:30:00.000Z\\", \\"startDate\\": \\"2025-02-04T18:30:00.000Z\\"}"
    },
    {
      "selector": "volunteer[1]",
      "metrics": [
        {
          "type": "Tone Consistency",
          "score": 3,
          "issues": [
            {
              "name": "Inconsistent information: The role and organization fields are contradictory.  Please clarify and ensure consistency.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Corrected inconsistent information; removed the conflicting role and location to focus on the organization.",
      "final_output": "{ \\"id\\": \\"74f91a01-24c9-43e3-9b45-13ea93505f45\\", \\"organization\\": \\"Brightwave Global\\", \\"endDate\\": \\"2025-02-12T18:30:00.000Z\\", \\"startDate\\": \\"2025-02-26T18:30:00.000Z\\"}"
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
      "selector": "summary.content",
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
  ]`
  const parsed = JSON.parse(text)
  const [aiSuggestions, setAiSuggestions] = useState<AIReviewResult[] | null>(
    parsed
  );
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
}`
  const testparseresume = JSON.parse(testresume)
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
  
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };


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

  const chartConfig: ChartConfig = jd
    ? {
      alignment_with_jd_requirements: {
        label: "Alignment",
        color: "hsl(var(--chart-1))",
      },
      completeness_for_jd: {
        label: "Completeness",
        color: "hsl(var(--chart-2))",
      },
      specific_achievements_relevant_to_jd: {
        label: "Achievements",
        color: "hsl(var(--chart-3))",
      },
      keyword_matching: {
        label: "Keywords",
        color: "hsl(var(--chart-4))",
      },
      overall_suitability: {
        label: "Suitability",
        color: "hsl(var(--chart-5))",
      },
    }
    : {
      clarity_and_readability: {
        label: "Clarity",
        color: "hsl(var(--chart-1))",
      },
      completeness: {
        label: "Completeness",
        color: "hsl(var(--chart-2))",
      },
      detail_and_specificity: {
        label: "Detail",
        color: "hsl(var(--chart-3))",
      },
      relevance: {
        label: "Relevance",
        color: "hsl(var(--chart-4))",
      },
      grammar_and_language: {
        label: "Grammar",
        color: "hsl(var(--chart-5))",
      },
    };

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
    try {
      //console.log(reviewType);

      const response = await axios.post(`/api/get-resume-review`, {
        resumeId: selectedResume,
        resumeOption,
        resumeText,
        jd: jd,
        reviewType: reviewType,
      });
      setResumeData(response?.data?.resume);
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
      //console.log(error);
    } finally {
      setIsLoading(false);
    }
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
          {/* <textarea name="" id="" value={JSON.stringify("Asd",null,2)}></textarea> */}
          {aiSuggestions && (
            <div className="">
              {/* Left Column */}
              <div>
                <AnimatePresence>
                  <h2 className="text-2xl font-bold mb-6">Issues</h2>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <Card>
                      <CardContent>
                        <div className="space-y-4">
                          {aiSuggestions.map((suggestion, index) => (
                            <Accordion type="single" collapsible key={index}>
                              <AccordionItem value={suggestion.selector}>
                                <AccordionTrigger>
                                  <div className="flex items-center justify-between w-full">
                                    <span className="capitalize">{suggestion.selector.replace(/_/g, " ")}</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4">
                                    {suggestion.metrics.map((metric, idx) => (
                                      <Card key={idx}>
                                        <CardContent className="space-y-4">
                                          <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-medium">{metric.type}</span>
                                            <div className="flex items-center gap-2">
                                              <Progress value={metric.score  * 10} className="w-24" />
                                              <span className="text-sm font-medium">{metric.score}/10</span>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">Issues:</p>
                                            {metric.issues.map((issue, issueIdx) => (
                                              <div key={issueIdx} className="p-2 rounded-lg">
                                                <p className="text-sm font-medium">{issue.name}</p>
                                                <p className="text-xs text-red-500">Severity: {issue.severity}</p>
                                              </div>
                                            ))}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">Original:</p>
                                            <pre className="text-sm p-2 rounded-lg text-wrap">
                                              {JSON.stringify(getProperty(resumeData,suggestion.selector),null, 2)|| "N/A"}
                                            </pre>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">Final Output:</p>
                                            <pre className="text-sm p-2 rounded-lg text-wrap">
                                              {JSON.stringify(suggestion.final_output, null, 2) || "N/A"}
                                            </pre>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column */}
              <div>{/* Placeholder for future content */}</div>
            </div>
          )}
        </div>
      </motion.main>
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
