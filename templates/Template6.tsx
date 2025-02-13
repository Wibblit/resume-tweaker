"use client";

import React from "react";
import { ResumeData } from "@/types/types";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import HTMLViewer from "@/components/HTMLViewer";
import { SocialIcon } from "react-social-icons";
import { formatDate } from "@/utils/formatDate";

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

interface ModernResumeTemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  pageIndex: number;
}

export default function Component({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}: ModernResumeTemplateProps) {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const dispatch = useAppDispatch();
  const isIcons = useAppSelector((state) => state?.rightsidebar?.icons);
  const isSeperator = useAppSelector((state) => state?.rightsidebar?.separator);

  React.useEffect(() => {
    dispatch(UpdateBaseColor(baseColor));
  }, [dispatch, baseColor]);

  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: 0,
      display: "flex",
      minHeight: "1122.66px",
    },
    ribbon: {
      width: "50px",
      backgroundColor: baseColor,
      flexShrink: 0,
      minHeight: "1122.66px",
    },
    content: {
      flex: 1,
      padding: `${margin}mm`,
    },
    sectionTitle: {
      color: baseColor,
      fontSize: "1.4em",
      fontWeight: "bold",
      marginBottom: "1em",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: isSeperator ? `2px solid ${baseColor}` : "none", // Conditional border
    },
    subtitle: {
      fontSize: "1.2em",
      fontWeight: "bold",
      color: "#000",
    },
    normal: {
      fontSize: "1.2em",
      color: "#000",
    },
    link: {
      color: baseColor,
      textDecoration: "none",
    },
  };

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "basics":
        const basics = content.basics?.[0];
        if (!basics) return null;
        return (
          <div className="mb-6">
            <h1
              className="text-6xl font-bold tracking-tight mb-4"
              style={{ fontSize: "3rem" }}
            >
              {basics.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {basics.location && <span>{basics.location}</span>}
              {basics.phone && (
                <>
                  <span>|</span>
                  <span>{basics.phone}</span>
                </>
              )}
              {basics.email && (
                <>
                  <span>|</span>
                  <span>{basics.email}</span>
                </>
              )}
              {basics.url && (
                <>
                  <span>|</span>
                  <a
                    href={basics.url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
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
          <section className="mb-6">
            <HTMLViewer
              lineHeight={lineHeight}
              content={content.summary[0].content}
            />
          </section>
        );

      case "experience":
        if (!content.experience?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Experience</h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold">{exp.organization}</h3>
                    <p className="text-gray-600 italic">{exp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {exp.startDate && formatDate(exp.startDate, datetype)}
                      {exp.endDate && " - "}
                      {exp.endDate && formatDate(exp.endDate, datetype)}
                    </p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                </div>
                {exp.summary && (
                  <HTMLViewer lineHeight={lineHeight} content={exp.summary} />
                )}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!content.education?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Education</h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex-col justify-between items-start mb-1">
                  <div className="text-right flex items-center justify-between">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <p className="font-bold">
                      {edu.startDate && formatDate(edu.startDate, datetype)}
                      {edu.endDate && " - "}
                      {edu.endDate && formatDate(edu.endDate, datetype)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <p className="text-gray-600">
                      {edu.degree}
                      {edu.field && `, ${edu.field}`}
                    </p>
                    {edu.score && (
                      <p className="text-gray-600">
                        GPA: <span className="font-bold">{edu.score}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "skills":
        if (!content.skills?.length) return null;

        // Get all skills in a flat array
        const allSkills = content.skills.flatMap(category => category.skills);
        
        // Calculate how many rows we need (5 items per row)
        const rowCount = Math.ceil(allSkills.length / 5);
        
        // Create chunks of 5 skills for each column
        const columns = [];
        for (let i = 0; i < rowCount; i++) {
          columns.push(allSkills.slice(i * 5, (i + 1) * 5));
        }      
        return (
          <section className="mb-6">
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div className="grid grid-cols-4 gap-4">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col">
                {column.map((skill, index) => (
                  <p key={index} className="mb-1 text-gray-600">
                    • {skill.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
        );

      case "projects":
        if (!content.projects?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <h3 className="font-bold">{project.name}</h3>
                    {project.url && (
                      <a
                        href={project.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                        className="text-xs ml-2"
                      >
                        {project.url.label}
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {project.startDate &&
                        formatDate(project.startDate, datetype)}
                      {project.endDate && " - "}
                      {project.endDate && formatDate(project.endDate, datetype)}
                    </p>
                  </div>
                </div>
                <HTMLViewer lineHeight={lineHeight} content={project.summary} />
                {project.keywords && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.keywords.map((keyword, keywordIndex) => (
                      <span
                        key={keywordIndex}
                        className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!content.certifications?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Certifications and Courses</h2>
            {content.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <div className="flex-col justify-between items-start mb-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="font-bold">
                      {cert.date && formatDate(cert.date, datetype)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">{cert.issuer}</p>
                    {cert.url && (
                      <a
                        href={cert.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                        className="text-xs"
                      >
                        {cert.url.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "languages":
        if (!content.languages?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Languages</h2>
            <div className="grid grid-cols-4 gap-x-4">
              {content.languages.map((lang, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold">{lang.name}</span>
                  {lang.level && (
                    <span className="ml-2 text-gray-600">: {lang.level}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "profiles":
        if (!content.profiles?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Profiles</h2>
            <div className="flex flex-wrap gap-4">
              {content.profiles.map((profile, index) => (
                <div key={index} className="flex items-center gap-2">
                  {isIcons && profile.url.href !== "" && (
                    <SocialIcon
                      style={{ width: "24px", height: "24px" }}
                      url={profile.url.href}
                    />
                  )}
                  <a
                    href={profile.url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    className="text-sm"
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
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>References</h2>
            <div className="flex flex-wrap gap-4">
              {content.references.map((ref, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">{ref.name}</h3>
                  <p className="text-gray-600">{ref.phone}</p>
                  <p className="text-gray-600">{ref.email}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "volunteerings":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Volunteer Experience</h2>
            {content.volunteer.map((vol, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold">{vol.organization}</h3>
                    <p className="text-gray-600 italic">{vol.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {vol.startDate && formatDate(vol.startDate, datetype)}
                      {vol.endDate && " - "}
                      {vol.endDate && formatDate(vol.endDate, datetype)}
                    </p>
                    <p className="text-gray-600">{vol.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "publications":
        if (!content.publications?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Publications</h2>
            {content.publications.map((pub, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <h3 className="font-bold">{pub.name}</h3>
                    {pub.url && (
                      <a
                        href={pub.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                        className="text-xs ml-2"
                      >
                        {pub.url.label}
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {pub.date && formatDate(pub.date, datetype)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">{pub.publisher}</p>
                  {pub.publishedIn && (
                    <p className="text-gray-600">{pub.publishedIn}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "awards":
        if (!content.awards?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between  items-start mb-1">
                  <div className="flex items-center">
                    <h3 className="font-bold">{award.title}</h3>
                    {award.awarder && (
                      <p className="text-gray-600">
                        <span className="mx-1">by</span>
                        <span className="font-bold">{award.awarder}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {award.date && formatDate(award.date, datetype)}
                    </p>
                  </div>
                </div>
                {award.summary && (
                  <HTMLViewer lineHeight={lineHeight} content={award.summary} />
                )}
              </div>
            ))}
          </section>
        );

      default:
        if (
          !content ||
          !Array.isArray(content[sectionName]) ||
          //@ts-ignore
          !content[sectionName]?.length
        )
          return null;
        return (
          <div className="mb-6">
            <h2>{sectionName}</h2>
            {
              //@ts-ignore
              content[sectionName] &&
                //@ts-ignore
                Array.isArray(content[sectionName]) &&
                //@ts-ignore
                content[sectionName]?.map((sec: Custom, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col justify-between">
                      {/* Main Row: Name, Location, Link on the left; Dates on the right */}
                      <div className="flex items-center justify-between">
                        {/* Left Section: Name, Location, Link */}
                        <div className="flex items-center gap-2">
                          {/* Name */}
                          {sec.name && <h3>{sec.name}</h3>}

                          {/* Location */}
                          {sec.location && <p className="">, {sec.location}</p>}

                          {/* URL Link */}
                          {sec.url && (
                            <a
                              href={sec.url.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center mx-2"
                            >
                              <p>
                                {sec.url.label && (
                                  <span className="mx-1">|</span>
                                )}
                                {sec.url.label}
                              </p>
                            </a>
                          )}
                        </div>

                        {/* Right Section: Dates */}
                        <div>
                          {/* Start Date and End Date */}
                          {sec.startDate && (
                            <h3>
                              {formatDate(sec.startDate, datetype)}
                              {sec.endDate &&
                                ` - ${formatDate(sec.endDate, datetype)}`}
                            </h3>
                          )}
                        </div>
                      </div>

                      {/* Description: Placed below the main row */}
                      {sec.description && (
                        <p className="mt-1">{sec.description}</p>
                      )}

                      {/* Summary: Placed below the description */}
                      {sec.summary && (
                        <div className="mt-2">
                          <HTMLViewer
                            lineHeight={lineHeight}
                            content={sec.summary}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>
        );
    }
  };

  return (
    <div className="no-ltwave" style={styles.container}>
      <div style={styles.ribbon} />
      <div style={styles.content}>
        <style>
          {`
            .no-ltwave * {
              font-family: inherit;
            }
            .no-ltwave p {
              color: inherit;
              font-size: ${fontSize}px;
              line-height: ${lineHeight};
              white-space: pre-wrap; 
              word-wrap: break-word; 
              overflow-wrap: break-word;
            }
            .no-ltwave li {
              color: inherit;
            }
          `}
        </style>
        {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
          renderSection(sectionName as SectionName)
        )}
      </div>
    </div>
  );
}
