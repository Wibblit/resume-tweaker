"use client";

import React from "react";
import { ResumeData } from "@/types/types";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import HTMLViewer from "@/components/HTMLViewer";
import DateConverter from "@/components/DateConverter";
import { SocialIcon } from "react-social-icons";

type SectionName =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "profiles"
  | "basics"
  | "references"
  | "volunteerings"
  | "publications"
  | "awards";

interface StanfordResumeTemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  pageIndex: number;
}

function formatMonthYear(input: string): string {
  // Extract the month and year from the input
  const [_, month, year] = input.match(/(\w+)'(\d{2})/) || [];

  // Define a mapping of month names to their numbers
  const monthMap: { [key: string]: string } = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // Return the formatted result
  return `${monthMap[month]}/${year}`;
}

// Example usage
const result = formatMonthYear("24, Nov'24");
console.log(result); // Output: "11/24"


export default function Component({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}: StanfordResumeTemplateProps) {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(UpdateBaseColor(baseColor));
  }, [dispatch, baseColor]);



    const isIcons = useAppSelector((state) => state?.rightsidebar?.icons)
    const isSeperator = useAppSelector((state) => state?.rightsidebar?.separator)
    
  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      maxWidth: "800px",
      margin: "0 auto",
      color: "#000",
    } as React.CSSProperties,
    header: {
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: "1.1em",
      fontWeight: "bold",
      textTransform: "uppercase" as const,
      borderTop: isSeperator && "2px solid #000",
      marginTop: "1rem",
      paddingTop: "0.5rem",
      marginBottom: "1rem",
    } as React.CSSProperties,
    dateRange: {
      fontWeight: "normal",
    } as React.CSSProperties,
  };

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "basics":
        const basics = content.basics?.[0];
        if (!basics) return null;
        return (
          <div style={styles.header}>
            <h1 className="text-2xl font-bold uppercase mb-1">{basics.name}</h1>
            <div className="text-sm space-x-1">
              {basics.location && <span>{basics.location}</span>}
              {basics.phone && (
                <>
                  <span>•</span>
                  <span>{basics.phone}</span>
                </>
              )}
              {basics.email && (
                <>
                  <span>•</span>
                  <span>{basics.email}</span>
                </>
              )}
              {basics.url && (
                <>
                  <span>•</span>
                  <a
                    href={basics.url.href}
                    className="text-black hover:underline"
                  >
                    {basics.url.label}
                  </a>
                </>
              )}
            </div>
          </div>
        );

      case "summary":
        if (!content.summary?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Summary</h2>
            <HTMLViewer
              lineHeight={lineHeight}
              content={content.summary[0].content}
            />
          </section>
        );

      case "education":
        if (!content.education?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Education
            </h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div
                  className="flex-shrink-0 w-[160px] mr-4"
                  style={styles.dateRange}
                >
                  {edu.startDate &&
                    formatMonthYear(DateConverter(edu.startDate))}
                  {edu.endDate &&
                    ` - ${formatMonthYear(DateConverter(edu.endDate))}`}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold">{edu.institution}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {edu.degree && <div>• {edu.degree}</div>}
                    {edu.field && <div>• {edu.field}</div>}
                    {edu.score && <div>• GPA - {edu.score}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!content.experience?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Experience
            </h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div
                  className="flex-shrink-0 w-[160px] mr-4"
                  style={styles.dateRange}
                >
                  {exp.startDate &&
                    formatMonthYear(DateConverter(exp.startDate))}
                  {exp.endDate &&
                    ` - ${formatMonthYear(DateConverter(exp.endDate))}`}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold">{exp.role}</span>
                      {exp.organization && <span>, {exp.organization}</span>}
                      {exp.location && <span>, {exp.location}</span>}
                    </div>
                  </div>
                  {exp.summary && (
                    <div className="">
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={exp.summary}
                        className="text-inherit"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "skills":
        if (!content.skills?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Skills</h2>
            {content.skills.map((category, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{category.name}: </span>
                <span>
                  {category.skills.map((skill) => skill.name).join(", ")}
                </span>
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!content.projects?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div className="w-[160px] flex-shrink-0 mr-4">
                  <span style={styles.dateRange}>
                    {project.startDate &&
                      formatMonthYear(DateConverter(project.startDate))}
                    {project.endDate &&
                      ` - ${formatMonthYear(DateConverter(project.endDate))}`}
                  </span>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-bold">{project.name}</span>
                  </div>
                  {project.summary && (
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={project.summary}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!content.certifications?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Certifications
            </h2>
            {content.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span>, {cert.issuer}</span>}
                {cert.date && (
                  <span className="ml-2">
                    ({formatMonthYear(DateConverter(cert.date))})
                  </span>
                )}
              </div>
            ))}
          </section>
        );

      case "languages":
        if (!content.languages?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Languages
            </h2>
            <div>
              {content.languages.map((lang, index) => (
                <span key={index} className="mr-4">
                  {lang.name} ({lang.level})
                </span>
              ))}
            </div>
          </section>
        );

      case "profiles":
        if (!content.profiles?.length) return null;
        return (
          <section className="mb-4 flex-col">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Profiles</h2>
            <div className="flex gap-2">
              {content.profiles.map((profile, index) => (
                <div key={index} className="mb-1">
                  {isIcons && profile.url.href !== "" && (
                    <SocialIcon
                      style={{ width: "16px", height: "16px" }}
                      url={profile.url.href}
                    />
                  )}
                  <a
                    href={profile.url.href}
                    className="text-black hover:underline ml-1"
                  >
                    {profile.url.label}
                  </a>
                </div>
              ))}
            </div>
          </section>
        );

      case "references":
        if (!content.references?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              References
            </h2>
            {content.references.map((ref, index) => (
              <div key={index} className="mb-2">
                <div className="font-bold">{ref.name}</div>
                <div>{ref.phone}</div>
                <div>{ref.email}</div>
              </div>
            ))}
          </section>
        );

      case "volunteerings":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Volunteer Experience
            </h2>
            {content.volunteer.map((vol, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold">{vol.role}</span>
                    {vol.organization && <span>, {vol.organization}</span>}
                  </div>
                  <div style={styles.dateRange}>
                    {vol.startDate &&
                      formatMonthYear(DateConverter(vol.startDate))}
                    {vol.endDate &&
                      ` - ${formatMonthYear(DateConverter(vol.endDate))}`}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "publications":
        if (!content.publications?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Publications
            </h2>
            {content.publications.map((pub, index) => (
              <div key={index} className="mb-2">
                <div className="font-bold">{pub.name}</div>
                <div>
                  {pub.publisher}
                  {pub.date && (
                    <span>, {formatMonthYear(DateConverter(pub.date))}</span>
                  )}
                </div>
                {pub.url && (
                  <a href={pub.url.href} className="text-black hover:underline">
                    {pub.url.label}
                  </a>
                )}
              </div>
            ))}
          </section>
        );

      case "awards":
        if (!content.awards?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} className="mb-2 flex w-full">
                {/* Fixed width date container */}
                <div className="basis-[160px] flex-shrink-0 mr-4">
                  {award.date && (
                    <span>{formatMonthYear(DateConverter(award.date))}</span>
                  )}
                </div>

                {/* Flexible content container */}
                <div className="flex-grow">
                  <div className="font-bold">{award.title}</div>
                  <div>{award.awarder}</div>
                  {award.summary && (
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={award.summary}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  );
}
