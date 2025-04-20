"use client";
import React from "react";
import { ResumeData, ResumeDataTemp, Custom } from "@/types/types";
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
  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);
  const isSeparator = useAppSelector((state) => state.rightsidebar.separator);

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
      fontSize: "1.1em",
      fontWeight: "bold",
      marginBottom: isSeparator ? "0.5em" : "none",
      textTransform: "uppercase",
      borderBottom: isSeparator ? `2px solid ${baseColor}` : "none",
      paddingBottom: "0.25em",
    },
    sectionTitleWithOutBorder: {
      color: baseColor,
      fontSize: "1.1em",
      fontWeight: "bold",
      marginBottom: "0.5em",
      textTransform: "uppercase",
      paddingBottom: "0.25em",
    },
    subtitle: {
      fontSize: "1.05em",
      fontWeight: "bold",
      color: "#000",
    },
    normal: {
      fontSize: "1em",
      color: "#000",
    },
    link: {
      color: baseColor,
      fontSize: "1em",
    },
    linklabel: {
      color : baseColor
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
            <p className="text-center mb-2" style={styles.normal}>{basics.headLine}</p>
            <div className="flex justify-around items-center space-x-2" >
              <p style={styles.normal}>{basics.email}</p>
              {basics.phone && (
                <p style={styles.normal}>
                  <span className="mx-1">|</span>
                  {basics.phone}
                </p>
              )}
              {basics.location && (
                <p style={styles.normal}>
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
                  <p style={styles.normal}>
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
          <section className="mb-2 text-black">
            <h2 style={styles.sectionTitle}>Summary</h2>
            {/* <p>{content.summary[0].content}</p> */}
            <div className="" style={styles.normal}>
              <HTMLViewer
                lineHeight={lineHeight}
                content={content.summary[0].content}
              />
            </div>
          </section>
        );

      case "skills":
        if (content.skills?.length === 0) return null;
        return (
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div className="grid grid-cols-2">
              {content?.skills?.map((category, index) => (
                <div key={index} className="mb-2 mr-4">
                  <div className="">
                    <div className="w-full flex items-center justify-between">
                      <h3 className="py-1" style={styles.subtitle}>
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-start justify-start gap-1">
                      {category.skills.map((skill, skillIndex) => (
                        <p key={skillIndex} style={styles.normal} className="flex items-center">
                          {skill.level && skill.level.trim() !== ""
                            ? `${skill.name} (${skill.level})`
                            : skill.name}
                          {skillIndex !== category.skills.length - 1 && (
                            <div style={styles.divider} className="inline-block ml-1">|</div>
                          )}
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
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Education</h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{edu.institution}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        <div className={`flex font-semibold flex-wrap  justify-end gap-0 items-center whitespace-nowrap`}>
                          {edu.startDate && <div>{formatDate(edu.startDate, datetype)}</div>}
                          {edu.endDate && <div className="flex items-center"><div className="mx-1">{(edu.startDate && edu.endDate) ? "-" : ""}</div> {formatDate(edu.endDate, datetype)}</div>}
                        </div>
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
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Experience</h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between" style={styles.subtitle}>
                    <h3 style={styles.subtitle}>{exp.organization}</h3>
                    <div>
                      <h3 style={styles.subtitle}>
                        <div className={`flex font-semibold flex-wrap  justify-end gap-0 items-center whitespace-nowrap`}>
                          {exp.startDate && <div>{formatDate(exp.startDate, datetype)}</div>}
                          {exp.endDate && <div className="flex items-center"><div className="mx-1">{(exp.startDate && exp.endDate) ? "-" : ""}</div> {formatDate(exp.endDate, datetype)}</div>}
                        </div>
                      </h3>
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-between mb-1" style={styles.normal}>
                    <p
                      className="italic"
                      style={{
                        fontSize:
                          typeof styles.subtitle?.fontSize === "string"
                            ? `${parseFloat(
                              styles.subtitle.fontSize.replace("em", "")
                            ) * 0.85
                            }em`
                            : typeof styles.subtitle?.fontSize === "number"
                              ? styles.subtitle.fontSize * 0.8
                              : undefined,
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize:
                          typeof styles.subtitle?.fontSize === "string"
                            ? `${parseFloat(
                              styles.subtitle.fontSize.replace("em", "")
                            ) * 0.85
                            }em`
                            : typeof styles.subtitle?.fontSize === "number"
                              ? styles.subtitle.fontSize * 0.8
                              : undefined,
                      }}
                    >
                      {exp.location}
                    </p>
                  </div>
                </div>
                {/* {exp.summary && <p className="mt-2">{exp.summary.trim()}</p>} */}
                {exp.summary && (
                  <div className="" style={styles.normal}>
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
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle} className="text-nowrap">
                        {project.name}
                      </h3>
                      {project.url && (
                        <a
                          href={project.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                          className="w-full text-left inline-block"
                        >
                          <p style={{ ...styles.normal, ...styles.link }}>
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
                        <div className={`flex font-semibold flex-wrap  justify-end gap-0 items-center whitespace-nowrap`}>
                          {project.startDate && <div>{formatDate(project.startDate, datetype)}</div>}
                          {project.endDate && <div className="flex items-center"><div className="mx-1">{(project.startDate && project.endDate) ? "-" : ""}</div> {formatDate(project.endDate, datetype)}</div>}
                        </div>
                      </h3>
                    </div>
                  </div>
                  {/* <p className="w-full text-left mt-1">{project.summary}</p> */}
                  {project.keywords.length !== 0 &&
                    project.keywords[0] !== "" && (
                      <div className="w-full flex flex-wrap items-center justify-start gap-x-2 space-x-1">
                        <span style={styles.normal} className="font-medium">
                          Skills:
                        </span>
                        {project.keywords.map((keyword, keywordIndex) => (
                          <span
                            key={keywordIndex}
                            className="font-medium"
                            style={styles.normal}
                          >
                            {keyword}
                            {keywordIndex !== project.keywords.length - 1 &&
                              ", "}
                          </span>
                        ))}
                      </div>
                    )}
                  <div className="w-full items-start mt-1" style={styles.normal}>
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
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Certifications and Courses</h2>
            {content.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 style={styles.subtitle}>{cert.name}</h3>
                    <div>
                      <h3 style={styles.normal}>
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
                        <p style={{ ...styles.normal, ...styles.link }}>
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
          <section className="mb-2">
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
          <section className="mb-2">
            <div className="flex flex-wrap space-x-4">
              {content.profiles.map((profile, index) => (
                <div
                  className="flex gap-2 items-center"
                  key={index}
                >
                  <a
                    key={index}
                    href={profile.url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    className="flex items-center gap-2" // Added gap-2 for consistent spacing
                  >
                    {isIcons && profile.url.href !== "" && (
                      <SocialIcon
                        style={{ width: "18px", height: "18px"}} // Added marginRight for spacing
                        fgColor={"white"}
                        bgColor={"black"}
                        url={profile.url.href}
                      />
                    )}
                    <span className="no-underline" style={styles.linklabel}>{profile.url.label}</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        );

      case "references":
        if (!content.references?.length) return null;
        return (
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>References</h2>
            <div className="space-y-1">
              {content.references.map((ref, index) => (
                <div key={index} className="flex justify-between">
                  <h3 style={styles.subtitle} className="font-semibold">
                    {ref.name}
                  </h3>
                  <p>{ref.phone}</p>
                  <p>{ref.email}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case "volunteer":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Volunteer Experience</h2>
            <div className="space-y-2">
              {content.volunteer.map((vol, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between">
                    <h3 style={styles.subtitle}>{vol.organization}</h3>
                    <p style={styles.subtitle}>
                      <div className={`flex font-semibold flex-wrap  justify-end gap-0 items-center whitespace-nowrap`}>
                        {vol.startDate && <div>{formatDate(vol.startDate, datetype)}</div>}
                        {vol.endDate && <div className="flex items-center"><div className="mx-1">{(vol.startDate && vol.endDate) ? "-" : ""}</div> {formatDate(vol.endDate, datetype)}</div>}
                      </div>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>{vol.role}</p>
                    <p>{vol.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "publications":
        if (!content.publications?.length) return null;
        return (
          <section className="mb-2">
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
                          <p style={{ ...styles.normal, ...styles.link }}>
                            {pub.url.label && <span className="mx-1">|</span>}
                            {pub.url.label}
                          </p>
                        </a>
                      )}
                    </div>
                    <h3 style={styles.normal}>
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
          <section className="mb-2">
            <h2 style={styles.sectionTitle}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between mb-0.5">
                    <div className="flex items-center">
                      <h3 style={styles.subtitle}>{award.title}</h3>

                      {award.awarder && (
                        <p style={styles.normal}>
                          <span className="mx-1" >|</span>
                          {award.awarder}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 style={styles.normal}>
                        {award.date && formatDate(award.date, datetype)}
                      </h3>
                    </div>
                  </div>
                  <div className="w-full items-center justify-start" style={styles.normal}>
                    {award.summary && (
                      // <p className="w-full text-left mt-1">{award.summary}</p>
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={award.summary}
                      />
                    )}
                  </div>
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
          <div className="mb-2">
            <h2 style={styles.sectionTitle}>{sectionName}</h2>
            {content[sectionName] &&
              Array.isArray(content[sectionName]) &&
              //@ts-ignore
              content[sectionName].map((sec: Custom, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col">
                    {/* Main Row: Name, Location, Link on the left; Dates on the right */}
                    <div className="flex justify-between">
                      {/* Left Section: Name, Location, Link */}
                      <div className="flex flex-wrap items-center">
                        {sec.name && (
                          <h3 style={styles.subtitle}>{sec.name}</h3>
                        )}
                        {sec.location && (
                          <p style={styles.subtitle}>, {sec.location}</p>
                        )}
                        {sec.url && (
                          <a
                            href={sec.url.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.link}
                            className="mx-2"
                          >
                            <span className="mx-1">{sec.url.label && "|"}</span>{" "}
                            {sec.url.label}
                          </a>
                        )}
                      </div>

                      {/* Right Section: Dates */}
                      {sec.startDate && (
                        <div style={styles.subtitle}>
                          <div className={`flex font-semibold flex-wrap  justify-end gap-0 items-center whitespace-nowrap`}>
                            {sec.startDate && <div>{formatDate(sec.startDate, datetype)}</div>}
                            {sec.endDate && <div className="flex items-center"><div className="mx-1">{(sec.startDate && sec.endDate) ? "-" : ""}</div> {formatDate(sec.endDate, datetype)}</div>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {sec.description && (
                      <p style={styles.normal} className="mt-1">
                        {sec.description}
                      </p>
                    )}

                    {/* Summary */}
                    {sec.summary && (
                      <div className="mt-1" style={styles.normal}>
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={sec.summary}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  );
};

export default ModernResumeTemplate;
