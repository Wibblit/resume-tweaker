"use client";
import React from "react";
import { ResumeData } from "@/types/types";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { Github, Linkedin, Globe } from "lucide-react";
import { useEffect } from "react";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import HTMLViewer from "@/components/HTMLViewer";
import { SocialIcon } from "react-social-icons";
import DateConverter from "@/components/DateConverter";

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

const ModernResumeTemplate: React.FC<ModernResumeTemplateProps> = ({
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

  const isIcons: boolean = useAppSelector(
    (state) => state?.rightsidebar?.icons
  );
  
  const isSeparator = useAppSelector((state) => state.rightsidebar.separator)

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
      borderBottom: isSeparator ? `2px solid ${baseColor}` : 'none',
      paddingBottom: "0.25em",
    },
    sectionTitleWithOutBorder: {
      color: baseColor,
      fontSize: "1.4em",
      fontWeight: "bold",
      marginBottom: "0.5em",
      textTransform: "uppercase",
      paddingBottom: "0.25em",
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
          <div className="flex flex-col items-center justify-center mb-3">
            <h1 className="text-3xl font-bold uppercase mb-1 text-center">
              {basics.name}
            </h1>
            <p className="text-lg text-center mb-2">{basics.headLine}</p>
            <div className="flex justify-around items-center space-x-2">
              <p>{basics.email}</p>
              {basics.phone && (
                <p>
                  <span className="mx-1">|</span>
                  {basics.phone}
                </p>
              )}
              {basics.location && (
                <p>
                  {" "}
                  <span className="mx-1">|</span>
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
                    {basics.url.label && <span className="mx-1">|</span>}
                    {basics.url.label}
                  </p>
                </a>
              )}
            </div>
          </div>
        );

      case "summary":
        if (!content.summary?.length) return null;
        return (
          <section className="mb-6 text-black">
            <h2 style={styles.sectionTitle}>Summary</h2>
            {/* <p>{content.summary[0].content}</p> */}
            <HTMLViewer
              lineHeight={lineHeight}
              content={content.summary[0].content}
            />
          </section>
        );

      case "skills":
        if (content.skills?.length === 0) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Skills</h2>
            {content?.skills?.map((category, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 className="py-1" style={styles.subtitle}>
                      {category.name}
                    </h3>
                  </div>
                  <div className="w-full flex flex-wrap items-start justify-start gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <p key={skillIndex}>
                        {skill.name}{" "}
                        {skillIndex !== category.skills.length - 1 && "|"}
                      </p>
                    ))}
                  </div>
                </div>
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
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{edu.institution}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {edu.startDate && DateConverter(edu.startDate)} {edu.endDate && " - "}{" "}
                        {edu.endDate &&  DateConverter(edu.endDate)}
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
                          |<span className="ml-2">{edu.specialization}</span>
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
            <h2 style={styles.sectionTitle}>Experience</h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{exp.organization}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {exp.startDate && DateConverter(exp.startDate)} {exp.endDate && " - "}{" "}
                        {exp.endDate && DateConverter(exp.endDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between">
                    <p className="italic">{exp.role}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {/* {exp.summary && <p className="mt-2">{exp.summary.trim()}</p>} */}
                {exp.summary && (
                  <HTMLViewer lineHeight={lineHeight} content={exp.summary} />
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!content.projects?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{project.name}</h3>
                      {project.url && (
                        <a
                          href={project.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                          className="w-full text-left mt-1 inline-block"
                        >
                          <p style={styles.normal}>
                            {project.url.label && (
                              <span className="mx-1">|</span>
                            )}

                            {project.url.label}
                          </p>
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 style={styles.subtitle}>
                        {project.startDate && DateConverter(project.startDate)}{" "}
                        {project.endDate && " - "}{" "}
                        {project.endDate && DateConverter(project.endDate)}
                      </h3>
                    </div>
                  </div>
                  {/* <p className="w-full text-left mt-1">{project.summary}</p> */}
                  <HTMLViewer
                    lineHeight={lineHeight}
                    content={project.summary}
                  />
                  {project.keywords && (
                    <div className="w-full flex flex-wrap items-start justify-start gap-2 mt-2">
                      {project.keywords.map((keyword, keywordIndex) => (
                        <p key={keywordIndex}>{keyword}</p>
                      ))}
                    </div>
                  )}
                </div>
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
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{cert.name}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {cert.date && DateConverter(cert.date)}
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
            <h2 style={styles.sectionTitle}>Languages</h2>
            <div className="flex flex-col flex-wrap justify-start">
              {content.languages.map((lang, index) => (
                <div key={index} className="w-1/2 mb-2">
                  <span style={styles.subtitle}>
                    {lang.name} {lang.level && " : "}
                  </span>{" "}
                  {lang.level}
                </div>
              ))}
            </div>
          </section>
        );

      case "profiles":
        if (!content.profiles?.length) return null;
        return (
          <section className="mb-6">
            <div className="flex flex-wrap justify-center space-x-4">
              {content.profiles.map((profile, index) => (
                <div
                  className="flex gap-1 items-center jsutify-center"
                  key={index}
                >
                  {isIcons && profile.url.href !== "" && (
                    <SocialIcon
                      style={{ width: "16px", height: "16px" }}
                      url={profile.url.href}
                    />
                  )}
                  <a
                    key={index}
                    href={profile.url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    className="flex items-center underline"
                  >
                    <span className="underline">{profile.url.label}</span>
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
            {content.references.map((ref, index) => (
              <div key={index} className="mb-2">
                <div className="w-full flex items-start justify-start space-x-4">
                  <h3 style={styles.subtitle}>{ref.name}</h3>
                  <p>{ref.phone}</p>
                  <p>{ref.email}</p>
                </div>
              </div>
            ))}
          </section>
        );

      case "volunteerings":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-6">
            <h2 style={styles.sectionTitle}>Volunteer Experience</h2>
            {content.volunteer.map((vol, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{vol.organization}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        {vol.startDate && DateConverter(vol.startDate)} -{" "}
                        {vol.endDate && DateConverter(vol.endDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between">
                    <p>{vol.role}</p>
                    <p>{vol.location}</p>
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
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full items-center flex justify-between">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{pub.name}</h3>
                      {pub.url && (
                        <a
                          href={pub.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                          className="flex items-center"
                        >
                          <p style={styles.normal}>
                            {pub.url.label && <span className="mx-1">|</span>}
                            {pub.url.label}
                          </p>
                        </a>
                      )}
                    </div>
                    <h3 style={styles.subtitle}>
                      {pub.date &&  DateConverter(pub.date)}
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
            <h2 style={styles.sectionTitle}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{award.title}</h3>

                      {award.awarder && (
                        <p>
                          <span className="mx-1">|</span>
                          {award.awarder}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 style={styles.subtitle}>
                        {award.date && DateConverter(award.date)}
                      </h3>
                    </div>
                  </div>

                  {award.summary && (
                    // <p className="w-full text-left mt-1">{award.summary}</p>
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
    `}
      </style>
      {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  );
};

export default ModernResumeTemplate;
