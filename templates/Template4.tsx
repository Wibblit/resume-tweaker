"use client";

import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector } from "@/hooks/hooks";
import { ResumeData } from "@/types/types";
import HTMLViewer from "@/components/HTMLViewer";
import { SocialIcon } from "react-social-icons";
import { formatDate } from "@/utils/formatDate";
import { PAGE_FORMATS } from "@/components/coverPage";
import { number } from "prop-types";

interface TemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  pageIndex: number;
}

export type SectionName =
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

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  baseColor: string;
}> = ({ title, children, baseColor }) => {
  const isSeparator = useAppSelector((state) => state?.rightsidebar?.separator);
  return (
    <section className="mb-1">
      <h2
        className={`mb-2 text-lg font-bold uppercase pb-1 ${
          isSeparator ? "border-b-2" : ""
        }`}
        style={
          isSeparator ? { color: baseColor, borderColor: baseColor } : undefined
        }
      >
        {title}
      </h2>

      {children}
    </section>
  );
};

const ResumeTemplate: React.FC<TemplateProps> = ({
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
  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);
  const paperformat = useAppSelector(
    (state) => state?.rightsidebar?.paperFormat
  );
  const styles = {
    container: {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#333",
      padding: `${margin}mm`,
      height: "100%",
    },
    linklabel: {
      color: baseColor,
      fontWeight : 300
    },
    subtitle: {
      fontWeight: 600,
      fontSize: `${fontSize + Math.floor(fontSize * 0.3)}px`,
    },
    subsidetitle: {
      fontWeight: 500,
      fontSize: `${fontSize + Math.floor(fontSize * 0.1)}px`,
    },
    text: {
      fontSize : `${fontSize}px`
    }
  };

  const BIGDOT = String.fromCharCode(9679);

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "experience":
        return (
          content.experience &&
          content.experience.length > 0 && (
            <Section title="Experience" baseColor={baseColor}>
              {content.experience.map((exp, index) => (
                <div className="flex">
                  {exp.organization && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-2">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <h3 style={styles.subtitle} className="mr-2">
                        {exp.organization}
                      </h3>
                      <span style={styles.text}>
                        {exp.startDate && formatDate(exp.startDate, datetype)} {exp.startDate && exp.endDate && <span className="mx-1">-</span>}
                        {exp.endDate && formatDate(exp.endDate, datetype)}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-baseline mb-1">
                      <em style={styles.subsidetitle} className="mt-1 mr-2">
                        {exp.role}
                      </em>
                      <span style={styles.text} >
                        {exp.location}
                      </span>
                    </div>
                    {exp.summary && (
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={exp.summary}
                      />
                    )}
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "education":
        return (
          content.education &&
          content.education.length > 0 && (
            <Section title="Education" baseColor={baseColor}>
              {content.education.map((edu, index) => (
                <div className="flex">
                  {edu.institution && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-3 w-full">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <h3 style={styles.subtitle} className="mr-2">
                        {edu.institution} {edu.institution && edu.degree && <span className="mx-1">|</span>}
                        <span style={styles.subsidetitle}>{edu.degree}</span>
                      </h3>
                      <span style={styles.text}>
                        {edu.startDate && formatDate(edu.startDate, datetype)}{" "}
                        {edu.endDate && edu.startDate && " - "}{" "}
                        {edu.endDate && formatDate(edu.endDate, datetype)}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-baseline mb-1">
                      <span style={styles.text} className=" mr-2">
                        {edu.field}{" "}
                        {edu.field && edu.specialization && (
                          <span className="mx-1">|</span>
                        )}
                        {edu.specialization}
                      </span>
                      {edu.score && (
                        <p style={styles.text} className=" mt-1">
                          {edu.score}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "skills":
        return (
          content.skills &&
          content.skills.length > 0 && (
            <Section title="Skills" baseColor={baseColor}>
              {content.skills.map((category, index) => (
                <div className="flex">
                  {category.name && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-2">
                    <h3 style={styles.subtitle} className=" mb-1">
                      {category.name}
                    </h3>
                    <p
                      style={styles.text}
                      className=" leading-snug break-words whitespace-pre-wrap"
                    >
                      {category.skills.map((skill) => skill.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "projects":
        return (
          content.projects &&
          content.projects.length > 0 && (
            <Section title="Projects" baseColor={baseColor}>
              {content.projects.map((project, index) => (
                <div className="flex">
                  {project.name && (
                    <p style={{ color: baseColor }} className="mr-1 mt-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-3">
                    <div className="flex flex-wrap justify-between items-center mb-1">
                      <div className="flex">
                        <h3
                          style={styles.subtitle}
                          className=" flex items-center font-semibold  mr-2"
                        >
                          {project.name}
                        </h3>
                        {project.url.href && (
                          <>
                            {" "}
                            {project.name && project.url.label && (
                              <p className="mr-1 ml-1"> | </p>
                            )}
                            <a
                              href={project.url.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center break-words"
                            >
                              <p style={styles.linklabel}>
                                {project.url.label}
                              </p>
                            </a>
                          </>
                        )}
                      </div>

                      <p style={styles.text}>
                        {project.startDate &&
                          formatDate(project.startDate, datetype)}
                        {project.endDate && " - "}
                        {project.endDate &&
                          formatDate(project.endDate, datetype)}
                      </p>
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
            </Section>
          )
        );
      case "certifications":
        return (
          content.certifications &&
          content.certifications.length > 0 && (
            <Section title="Certifications" baseColor={baseColor}>
              {content.certifications.map((cert, index) => (
                <div className="flex">
                  {cert.name && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div
                      key={index}
                      className="flex flex-wrap justify-between items-baseline mb-2"
                    >
                      <span
                        style={styles.subsidetitle}
                        className="font-semibold mr-2"
                      >
                        {cert.name}
                      </span>

                      {cert.url && (
                        <a
                          href={cert.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.linklabel}
                        >
                          ({cert.url.label})
                        </a>
                      )}
                    </div>
                    <span style={styles.text}>
                      {cert.date && formatDate(cert.date, datetype)}
                    </span>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "languages":
        return (
          content.languages &&
          content.languages.length > 0 && (
            <Section title="Languages" baseColor={baseColor}>
              <div className="flex flex-col items-start justify-start">
                {(content.languages || []).map((lang, index) => (
                  <div className="flex">
                    {lang.name && (
                      <p style={{ color: baseColor }} className="mr-1 mt-[5px]">
                        {BIGDOT}
                      </p>
                    )}

                    <div
                      key={index}
                      className="flex justify-start items-baseline w-full mt-1"
                    >
                      <span style={styles.text} className="font-semibold mr-2">
                        {lang.name || "Unknown"}
                      </span>
                      <span style={styles.text}>({lang.level || "N/A"})</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "references":
        return (
          content.references &&
          content.references.length > 0 && (
            <Section title="References" baseColor={baseColor}>
              {content.references.map((ref, index) => (
                <div className="flex">
                  {ref.name && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-3">
                    {/* Name */}
                    <h3 style={styles.subtitle} >
                      {ref.name}
                    </h3>

                    {/* Contact Details in a Single Line */}
                    <div className="flex flex-wrap  mt-1">
                      <a href={`tel:${ref.phone}`} style={styles.text}>
                        {ref.phone}
                      </a>
                      {ref.phone && ref.email && <span className="mx-1">|</span>}
                      <a href={`mailto:${ref.email}`} style={styles.text}>
                        {ref.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "volunteer":
        return (
          content.volunteer &&
          content.volunteer.length > 0 && (
            <Section title="Volunteer" baseColor={baseColor}>
              {content.volunteer.map((vol, index) => (
                <div className="flex">
                  {vol.organization && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-3 w-full">
                    <div className="flex flex-wrap justify-between w-full items-baseline">
                      <h3
                        style={styles.subtitle}
                        className="t font-semibold mr-2"
                      >
                        {vol.organization}
                      </h3>
                      <span style={styles.text}>
                        {vol.startDate && formatDate(vol.startDate, datetype)}
                        {vol.endDate && vol.startDate && " - "}
                        {vol.endDate && formatDate(vol.endDate, datetype)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p style={styles.text} className=" italic">{vol.role}</p>
                      <p style={styles.text}>{vol.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "publications":
        return (
          content.publications &&
          content.publications.length > 0 && (
            <Section title="Publications" baseColor={baseColor}>
              {content.publications.map((pub, index) => (
                <div className="flex">
                  {pub.name && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}

                  <div key={index} className="mb-3 w-full">
                    {/* First Row: Title (Left) & Date (Right) */}
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h3 style={styles.subtitle} className=" font-semibold break-words">
                        {pub.name}
                      </h3>
                      {pub.date && (
                        <p style={styles.text} className="">
                          {formatDate(pub.date, datetype)}
                        </p>
                      )}
                    </div>

                    {/* Second Row: Publisher & Published In (Left) & URL (Right) */}
                    <div className="flex justify-between items-baseline flex-wrap mt-1">
                      <p style={styles.text} className="break-words">
                        {pub.publisher}
                        {pub.publisher && pub.publishedIn && <span className="mx-1">|</span>}
                        {pub.publishedIn}
                      </p>
                      {pub.url && (
                        <a
                          href={pub.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.linklabel}
                          className=" break-words"
                        >
                          {pub.url.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "awards":
        return (
          content.awards &&
          content.awards.length > 0 && (
            <Section title="Awards" baseColor={baseColor}>
              {content.awards.map((award, index) => (
                <div className="flex">
                  {award.title && (
                    <p style={{ color: baseColor }} className="mr-1">
                      {BIGDOT}
                    </p>
                  )}
                  <div key={index} className="mb-2">
                    {/* Title & Date */}
                    <div className="flex flex-wrap justify-between items-baseline">
                      <h3 style={styles.subtitle} className=" font-semibold mr-2">
                        {award.title}
                      </h3>
                      {award.date && (
                        <span style={styles.text} className="">
                          {formatDate(award.date, datetype)}
                        </span>
                      )}
                    </div>

                    {/* Awarder Name */}
                    {award.awarder && (
                      <h3 style={styles.text} className="mt-1">
                        {award.awarder}
                      </h3>
                    )}

                    {/* Award Summary */}
                    {award.summary && (
                      <div className="mt-1">
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={award.summary}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Section>
          )
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
            <Section title={sectionName} baseColor={baseColor}>
              {" "}
              {
                //@ts-ignore
                content[sectionName] &&
                  //@ts-ignore
                  Array.isArray(content[sectionName]) &&
                  //@ts-ignore
                  content[sectionName]?.map((sec: Custom, index: number) => (
                    <div className="flex">
                      {sec.name && (
                        <p style={{ color: baseColor }} className="mr-1">
                          {BIGDOT}
                        </p>
                      )}
                      <div key={index} className="mb-4 w-full">
                        <div className="flex flex-col">
                          {/* First Row: Name, Location, URL (Left) & Dates (Right) */}
                          <div className="flex justify-between items-baseline">
                            {/* Left Section: Name, Location, URL */}
                            <div className="flex flex-wrap items-baseline">
                              {sec.name && (
                                <h3 style={styles.subtitle} className="font-semibold">{sec.name}</h3>
                              )}
                              {((sec.name && sec.location) || (sec.name && sec.url.label)) && <span className="mx-1">|</span>}
                              {sec.location && (
                                <span style={styles.text}>
                                  {sec.location}
                                </span>
                              )}
                              {((sec.url.label && sec.name) || (sec.url.label && sec.location)) && <span className="mx-1">|</span>}
                              {sec.url && (
                                <a
                                  href={sec.url.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={styles.linklabel}
                                >
                                  {sec.url.label}
                                </a>
                              )}
                            </div>

                            {/* Right Section: Dates */}
                            {sec.startDate && (
                              <span style={styles.text}>
                                {formatDate(sec.startDate, datetype)}
                                {sec.endDate && sec.startDate && <span className="mx-1">-</span>}
                                 { formatDate(sec.endDate, datetype)}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {sec.description && (
                            <p style={styles.text} className="mt-1">
                              {sec.description}
                            </p>
                          )}

                          {/* Summary */}
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
                    </div>
                  ))
              }
            </Section>
          </div>
        );
    }
  };

  const isIcons = useAppSelector((state) => state?.rightsidebar?.icons);

  return (
    <div
      style={styles.container}
      className="flex flex-col px-6 py-4"
    >
      <style>{`
      .resume-content, .resume-content * {
        font-family: ${fontFamily}, sans-serif !important;
      }
      p {
        color: black;
      }
    `}</style>

      {/* Header Section */}
      {content.basics && (
        <div>
          <div className=" flex-row flex items-start justify-between">
            {/* Left: Name & Headline */}
            <div className="w-full md:w-3/4">
              <h1
                style={{ color: baseColor }}
                className="text-3xl font-bold mb-0.5"
              >
                {content?.basics[0].name}
              </h1>
              <p style={styles.subsidetitle} className="mb-0.5">
                {content?.basics[0].headLine}
              </p>

              {/* Social Profiles */}
              <div className="flex flex-wrap gap-2 mt-1">
                {content?.profiles?.map((profile, index) => (
                  <div className="flex items-center gap-1" key={index}>
                    {isIcons && profile.url.href !== "" && (
                      <SocialIcon
                        style={{ width: "16px", height: "16px" }}
                        fgColor={"white"}
                        bgColor={"black"}
                        url={profile.url.href}
                      />
                    )}
                    <a
                      href={profile.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linklabel}
                      
                    >
                      {profile.url.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Contact Info */}
            <div style={styles.text} className="md:mt-0 flex flex-col items-end">
              <p className="break-words">{content?.basics[0].location}</p>
              <p className="break-words">
                <a
                  href={`tel:${content?.basics[0].phone}`}
                  className="hover:underline"
                >
                  {content?.basics[0].phone}
                </a>
              </p>
              <p className="break-words">
                <a
                  href={`mailto:${content?.basics[0].email}`}
                  className="hover:underline"
                >
                  {content?.basics[0].email}
                </a>
              </p>
              {content?.basics[0].url && (
                <a
                  href={content?.basics[0].url.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.linklabel}
                >
                  {content?.basics[0].url.label}
                </a>
              )}
            </div>
          </div>

          <div className="my-1" >
            {content.summary && content.summary[0].content && (
              <HTMLViewer
                lineHeight={lineHeight}
                content={content.summary[0].content!}
              />
            )}
          </div>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="flex flex-row w-full gap-6">
        {/* Left Column (60%) */}
        <div className="md:w-[70%] w-full">
          {sectionOrder.sections[pageIndex]?.column1.map((sectionName) => {
            if (sectionName !== "basics" && sectionName !== "profiles" && sectionName !== "summary") {
              return renderSection(sectionName as SectionName);
            } else {
              return null;
            }
          })}
        </div>

        {/* Right Column (40%) */}
        <div className="md:w-[30%] w-full">
          {sectionOrder.sections[pageIndex]?.column2.map((sectionName) => {
            if (sectionName !== "basics" && sectionName !== "profiles" && sectionName !== "summary") {
              return renderSection(sectionName as SectionName);
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
