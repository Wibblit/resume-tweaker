"use client";
import React from "react";
import { ResumeData } from "@/types/types";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { Github, Linkedin, Globe } from "lucide-react";
import { useEffect } from "react";
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
  | "volunteer"
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

const Template7: React.FC<ModernResumeTemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}) => {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UpdateBaseColor("#8B1F41"));
  }, []);

  const isIcons: boolean = useAppSelector(
    (state) => state?.rightsidebar?.icons
  );

  const isSeparator = false;
  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);
  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: `${margin}mm`,
    },
    sectionTitle: {
      color: baseColor,
      fontSize: "1.4em",
      fontWeight: "bold",
      marginBottom: isSeparator ? "0.5em" : "none",
      textTransform: "uppercase",
      borderBottom: isSeparator ? `2px solid ${baseColor}` : "none",
      paddingBottom: "0.25em",
    },
    sectionTitleWithOutBorder: {
      color: baseColor,
      fontSize: "1.4em",
      fontWeight: "bold",
      marginBottom: "0.5em",
      textTransform: "uppercase",
      paddingBottom: "0.25em",
      textAlign: "left",
    },
    subtitle: {
      fontSize: "1.2em",
      fontWeight: "bold",
      color: "#000",
      textAlign: "left",
    },
    normal: {
      fontSize: "1.2em",
      color: "#000",
      textAlign: "left",
    },
    undertitle: {
      fontSize: "1.2em",
      fontWeight: "semibold",
      color: "#000",
      textAlign: "left",
    },
    link: {
      color: baseColor,
      textDecoration: "none",
      textAlign: "left",
    },
    divider: {
      color: baseColor,
      textAlign: "left",
    },
  };
  function SectionTitle({ sectionName }: { sectionName: string }) {
    return (
      <div className="inline-block">
        <div className="h-1 mb-1 w-full" style={{ backgroundColor: baseColor }}></div>
        <h2 style={styles.sectionTitle}>{sectionName}</h2>
      </div>
    );
  }


  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "basics":
        const basics = content.basics?.[0];
        if (!basics) return null;
        return (
          <div>
          <div className="flex flex-col items-left justify-center mb-3">
            <h1
              className="text-3xl font-bold uppercase mb-1 text-left"
              style={{ color: baseColor }}
            >
              {basics.name}
            </h1>
            <h2 className="text-left text-xl font-bold mb-2">{basics.headLine}</h2>
            <div className="flex flex-wrap items-left space-x-2">
              <p>{basics.email}</p>
              {basics.phone && (
                <p>
                  <span className="mr-2" style={styles.divider}>|</span>
                  {basics.phone}
                </p>
              )}
              {basics.location && (
                <p>
                  {" "}
                  <span className="mr-2" style={styles.divider}>|</span>
                  {basics.location}
                </p>
              )}
              {basics.url && (
                <a
                  href={basics.url.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  <p>
                    {basics.url.label && <span className="mr-2" style={styles.divider}>|</span>}
                    {basics.url.label}
                  </p>
                </a>
              )}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-wrap space-x-4">
              {content.profiles?.map((profile, index) => (
                 <div className="flex items-center" key={index}>
                 <a
                   href={profile.url.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="no-underline flex items-center gap-1"
                 >
                   {isIcons && profile.url.href !== "" && (
                     <SocialIcon style={{ width: "24px", height: "24px" }} url={profile.url.href} />
                   )}
                   <span className="text-sm font-medium">{profile.url.label}</span>
                 </a>
               </div>
              
              ))}
            </div>
          </div>
          </div>
          
        );

      case "summary":
        if (!content.summary?.length) return null;
        return (
          <>
            <section className="mb-6 text-black " >
              <div className="inline-block">
                <SectionTitle sectionName={sectionName} />
              </div>
              <div style={styles.normal}>
                <HTMLViewer
                  lineHeight={lineHeight}
                  content={content.summary[0].content}
                />
              </div>
            </section>
          </>
        );

      case "skills":
        if (content.skills?.length === 0) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            <div className="grid grid-cols-2">
              {content?.skills?.map((category, index) => (
                <div key={index} className="mb-4 mr-4">
                  <div className="">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="py-1" style={styles.subtitle}>
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-start justify-start gap-1">
                      {category.skills.map((skill, skillIndex) => (
                        <p key={skillIndex} style={styles.normal}>
                          {skill.name}
                          {skillIndex !== category.skills.length - 1 && <div style={styles.divider} className="inline-block ml-1">|</div>}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        );

      case "education":
        if (!content.education?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{edu.institution}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {edu.startDate && formatDate(edu.startDate, datetype)}{" "}
                        {edu.startDate && edu.endDate && " - "}
                        {edu.endDate && formatDate(edu.endDate, datetype)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between">
                    <div className="flex items-center">
                      <p style={styles.normal} className="mr-2">
                        {edu.degree}
                        {edu.field && ","} {edu.field}
                      </p>{" "}
                      {edu.specialization && (
                        <p style={styles.normal} className="flex items-center">
                          {edu.specialization && <div style={styles.divider} className="inline-block">|</div>}<span className="ml-2" >{edu.specialization}</span>
                        </p>
                      )}
                    </div>

                    {edu.score && <p style={styles.normal}>{edu.score}</p>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!content.experience?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center mb-1">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{exp.organization}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {exp.startDate && formatDate(exp.startDate, datetype)}
                        {exp.startDate && exp.endDate && " - "}
                        {exp.endDate && formatDate(exp.endDate, datetype)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between ">
                    <h3 className="italic" style={styles.undertitle}>{exp.role}</h3>
                    <h3 style={styles.undertitle}>{exp.location}</h3>
                  </div>
                </div>
                {/* {exp.summary && <p className="mt-2">{exp.summary.trim()}</p>} */}
                {exp.summary && (<div style={styles.normal}>
                  <HTMLViewer lineHeight={lineHeight} content={exp.summary} />
                </div>
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!content.projects?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between">
                  <div className="w-full flex items-center justify-between">
                    {/* Left Section: Name + URL */}
                    <div className="flex items-center gap-2 text-nowrap">
                      <h3 style={styles.subtitle}>{project.name}</h3>
                      {project.url && (
                        <>
                          {project.url.label && <span className="" style={styles.divider}>|</span>}
                          <a
                            href={project.url.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.link}
                            className="text-left flex items-center"
                          >
                            <span style={styles.normal}>{project.url.label}</span>
                          </a>
                        </>
                      )}
                    </div>

                    {/* Right Section: Dates */}
                    <div className="flex-shrink-0">
                      <h3 style={styles.subtitle}>
                        {project.startDate && formatDate(project.startDate, datetype)}{" "}
                        {project.startDate && project.endDate && " - "}
                        {project.endDate && formatDate(project.endDate, datetype)}
                      </h3>
                    </div>
                  </div>
                  {project.keywords[0] != '' && project.keywords && (
                    <div className="w-full">
                      <div className="flex flex-wrap mb-1">
                        <h3 style={styles.subtitle}>Skills:</h3>
                        <p className="text-nowrap">
                          {project.keywords.map((keyword, keywordIndex) => (
                            <span key={keywordIndex}>
                              {keyword}{keywordIndex !== project.keywords.length - 1 ? ", " : undefined}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                  )}
                  <div style={styles.normal}>
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={project.summary}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!content.certifications?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{cert.name}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {cert.date && formatDate(cert.date, datetype)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between">
                    <p>{cert.issuer}</p>
                    {cert.url && (
                      <a
                        href={cert.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        <p className="underline" style={styles.normal}>
                          {cert.url.label}
                        </p>
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
            <SectionTitle sectionName={sectionName} />
            <div className="flex flex-row flex-wrap ">
              {content.languages.map((lang, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <span style={styles.subtitle}>
                    {lang.name}  {lang.level && " : "}
                  </span>{" "}<div className="inline-block" style={styles.normal}>{lang.level}</div>
                  {index !== (content.languages?.length ?? 0) - 1 && <span className="mx-1" style={styles.divider}>|</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case "profiles":
        if (!content.profiles?.length) return null;
        return (
          <div aria-hidden></div>
        );

      case "references":
        if (!content.references?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.references.map((ref, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center space-x-4">
                  <p style={styles.subtitle}>{ref.name}</p>
                  { ref.phone && <div style={styles.divider} className="inline-block">|</div>}
                  <p style={styles.normal}>{ref.phone}</p>
                  { ref.email && <div style={styles.divider} className="inline-block">|</div>}
                  <p style={styles.normal}>{ref.email}</p>
                </div>
              </div>
            ))}
          </section>
        );

      case "volunteer":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName + " experience"} />
            {content.volunteer.map((vol, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{vol.organization}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {vol.startDate && formatDate(vol.startDate, datetype)}{" "}
                        {vol.startDate && vol.endDate && " - "}
                        {vol.endDate && formatDate(vol.endDate, datetype)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between">
                    <p style={styles.undertitle}>{vol.role}</p>
                    <p style={styles.undertitle}>{vol.location}</p>
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
            <SectionTitle sectionName={sectionName} />
            {content.publications.map((pub, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center gap-1">
                  <div className="w-full items-center flex justify-between">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{pub.name}</h3>
                      {pub.url && (
                        <div className="flex items-center">
                        {pub.url.label && <span className="mx-1" style={styles.divider}>|</span>}
                        <a
                          href={pub.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          <div style={styles.normal}>
                            {pub.url.label}
                          </div>
                        </a>
                        </div>
                      )}
                    </div>
                    <h3 style={styles.subtitle}>
                      {pub.date && formatDate(pub.date, datetype)}
                    </h3>
                  </div>

                  <div className="w-full flex items-center justify-start">
                    <p>{pub.publisher}</p>
                    {pub.publishedIn && ","}&nbsp;
                    <p>{pub.publishedIn}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "awards":
        if (!content.awards?.length) return null;
        return (
          <section className="mb-6">
            <SectionTitle sectionName={sectionName} />
            {content.awards.map((award, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{award.title}</h3>
                      {award.awarder && (
                        <>
                          <span className="mx-1" style={styles.divider}>|</span>
                          <span style={styles.normal}>{award.awarder}</span>
                        </>
                      )}
                    </div>

                    <div>
                      <h3 style={styles.subtitle}>
                        {award.date && formatDate(award.date, datetype)}
                      </h3>
                    </div>
                  </div>

                  {award.summary && (
                    // <p className="w-full text-left mt-1">{award.summary}</p>
                    <div style={styles.normal}>
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={award.summary}
                      />
                    </div>
                  )}
                </div>
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
            <SectionTitle sectionName={sectionName} />
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
                        {sec.name && <h3 style={styles.subtitle}>{sec.name}</h3>}
                        {/* Location */}
                        {sec.location && <h3 style={styles.subtitle}><span className="mr-2" style={styles.divider}>|</span>{sec.location}</h3>}

                        {/* URL Link */}
                        <div className="flex items-center">
                      {sec.url && (
                        <div className="flex items-center" >
                        {sec.url.label && <span className="mx-1" style={styles.divider}>|</span>}
                        <a
                          href={sec.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          <div style={styles.normal}>
                            {sec.url.label}
                          </div>
                        </a>
                        </div>
                      )}
                    </div>
                      </div>

                      {/* Right Section: Dates */}
                      <div style={styles.subtitle}>
                        {/* Start Date and End Date */}
                        {sec.startDate && (
                          <h3 style={styles.subtitle}>
                          {sec.startDate && formatDate(sec.startDate, datetype)}{" "}
                          {sec.startDate && sec.endDate && " - "}
                          {sec.endDate && formatDate(sec.endDate, datetype)}
                        </h3>
                        )}
                      </div>
                    </div>

                    {/* Description: Placed below the main row */}
                    {sec.description && (
                      <p className="mt-1" style={styles.normal}>{sec.description}</p>
                    )}

                    {/* Summary: Placed below the description */}
                    {sec.summary && (
                      <div className="mt-2" style={styles.normal}>
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
    <div className="no-ltwave p-8" style={styles.container}>
      <style>
        {`
      /* Override any global font styles inside this container */
      .no-ltwave * {
        font-family: inherit; /* Ensures all elements inside no-ltwave inherit the default font */
      }

      .no-ltwave p {
        color: black;
        font-size: ${1.3 * fontSize}px;
        line-height: ${1.6 * fontSize}px;
        white-space: pre-wrap; 
        word-wrap: break-word; 
        overflow-wrap: break-word;
        text-align: justify;
      }
      li {
        color: black,
      }
    `}
      </style>
      {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  );
};

export default Template7;
