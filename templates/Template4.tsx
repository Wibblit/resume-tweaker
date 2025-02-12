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
    <section className="mb-4">
      <h2
        className="mb-2 text-lg font-bold uppercase border-b-2 pb-1"
        style={
          isSeparator
            ? {
                color: baseColor,
                borderColor: baseColor,
                borderBottomWidth: "2px",
              }
            : undefined
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
      fontSize: `${fontSize + Math.floor(fontSize * 0.4)}px`,
    },
    subsidetitle: {
      fontWeight: 500,
      fontSize: `${fontSize + Math.floor(fontSize * 0.1)}px`,
    },
    text: {
      fontSize : `${fontSize}px`
    }
  };

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "summary":
        return (
          content.summary &&
          content.summary.length > 0 && (
            <Section title="Summary" baseColor={baseColor}>
              <HTMLViewer
                lineHeight={lineHeight}
                content={content.summary[0].content}
              />
            </Section>
          )
        );
      case "experience":
        return (
          content.experience &&
          content.experience.length > 0 && (
            <Section title="Experience" baseColor={baseColor}>
              {content.experience.map((exp, index) => (
                <div  key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 style={styles.subtitle} className="mr-2">
                      {exp.organization}
                    </h3>
                    <span style={styles.text} className=" text-gray-600">
                      {exp.startDate && formatDate(exp.startDate, datetype)} -{" "}
                      {exp.endDate && formatDate(exp.endDate, datetype)}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <em style={styles.subsidetitle} className="mt-1 mr-2">{exp.role}</em>
                    <span style={styles.text} className=" text-gray-600">
                      {exp.location}
                    </span>
                  </div>
                  {exp.summary && (
                    // <p className="text-sm text-justify mt-1 leading-snug whitespace-pre-wrap">
                    //   {exp.summary}
                    // </p>
                    <HTMLViewer lineHeight={lineHeight} content={exp.summary} />
                  )}
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
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 style={styles.subtitle} className="mr-2">
                      {edu.institution} |{" "}
                      <span style={styles.subsidetitle}>{edu.degree}</span>
                    </h3>
                    <span style={styles.text} className=" text-gray-600">
                      {edu.startDate && formatDate(edu.startDate, datetype)}{" "}
                      {edu.endDate && edu.startDate && " - "}{" "}
                      {edu.endDate && formatDate(edu.endDate, datetype)}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <span style={styles.text} className=" mr-2">
                      {edu.field} {edu.field && edu.specialization && "|"}
                      {edu.specialization}
                    </span>
                    {edu.score && <p style={styles.text}  className=" mt-1">{edu.score}</p>}
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
                <div key={index} className="mb-2">
                  <h3 style={styles.subtitle} className=" mb-1">
                    {category.name}
                  </h3>
                  <p style={styles.text} className=" leading-snug break-words whitespace-pre-wrap">
                    {category.skills.map((skill) => skill.name).join(", ")}
                  </p>
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
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-center mb-1">
                    <h3 className="text-base flex items-center font-semibold text-gray-800 mr-2">
                      {project.name}
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
                            <p style={styles.linklabel}
                            >
                              {project.url.label}
                            </p>
                          </a>
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {project.startDate &&
                        formatDate(project.startDate, datetype)}
                      {project.endDate && " - "}
                      {project.endDate && formatDate(project.endDate, datetype)}
                    </p>
                  </div>
                  {project.summary && (
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={project.summary}
                    />
                  )}
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
                <div
                  key={index}
                  className="flex flex-wrap justify-between items-baseline mb-2"
                >
                  <span className="text-sm font-semibold mr-2">
                    {cert.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {cert.date && formatDate(cert.date, datetype)}
                  </span>
                  {cert.url && (
                    <a
                      href={cert.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      {cert.url.label}
                    </a>
                  )}
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
                {content.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-baseline w-full"
                  >
                    <span className="text-sm font-semibold mr-2">
                      {lang.name}
                    </span>
                    <span className="text-xs text-gray-600">{lang.level}</span>
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
                <div key={index} className="mb-2">
                  <h3 className="text-sm font-semibold">{ref.name}</h3>
                  <p className="text-xs break-words">
                    <a href={`tel:${ref.phone}`}>{ref.phone}</a>
                  </p>
                  <p className="text-xs break-words">
                    <a href={`mailto:${ref.email}`}>{ref.email}</a>
                  </p>
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
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-base font-semibold mr-2">
                      {vol.organization}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {vol.startDate && formatDate(vol.startDate, datetype)}{" "}
                      {vol.endDate && " - "}
                      {vol.endDate && formatDate(vol.endDate, datetype)}
                    </span>
                  </div>
                  <p className="text-sm italic mb-1">{vol.role}</p>
                  <p className="text-xs text-gray-600">{vol.location}</p>
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
                <div key={index} className="mb-2">
                  <h3 className="text-sm font-semibold break-words">
                    {pub.name}
                  </h3>
                  <p className="text-xs break-words">
                    {pub.publisher}, {pub.publishedIn}
                  </p>
                  <p className="text-xs text-gray-600">
                    {pub.date && formatDate(pub.date, datetype)}
                  </p>
                  {pub.url && (
                    <a
                      href={pub.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline"
                    >
                      {pub.url.label}
                    </a>
                  )}
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
                <div key={index} className="mb-2">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-sm font-semibold mr-2">
                      {award.title}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {award.date && formatDate(award.date, datetype)}
                    </span>
                  </div>
                  <h3 className="text-xs">{award.awarder}</h3>
                  {award.summary && (
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={award.summary}
                    />
                  )}
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

  const isIcons = useAppSelector((state) => state?.rightsidebar?.icons);

  return (
    <div
      style={styles.container}
      className="flex flex-col resume-content px-6 py-4"
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
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between">
          {/* Left: Name & Headline */}
          <div className="w-full md:w-3/4">
            <h1
              style={{ color: baseColor }}
              className="text-3xl font-bold mb-1"
            >
              {content?.basics[0].name}
            </h1>
            <p className="text-base text-gray-700 mb-2">
              {content?.basics[0].headLine}
            </p>

            {/* Social Profiles */}
            <div className="flex flex-wrap gap-2">
              {content?.profiles?.map((profile, index) => (
                <div className="flex items-center gap-2" key={index}>
                  {isIcons && profile.url.href !== "" && (
                    <SocialIcon
                      style={{ width: "16px", height: "16px" }}
                      url={profile.url.href}
                    />
                  )}
                  <a
                    href={profile.url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.linklabel}
                    className="underline text-sm  "
                  >
                    {profile.url.label}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="mt-4 md:mt-0 text-sm text-gray-800">
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
                className="text-blue-600 hover:underline"
              >
                {content?.basics[0].url.label}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Left Column (60%) */}
        <div className="md:w-[60%] w-full">
          {sectionOrder.sections[pageIndex]?.column1.map((sectionName) => {
            if (sectionName !== "basics" && sectionName !== "profiles") {
              return renderSection(sectionName as SectionName);
            } else {
              return null;
            }
          })}
        </div>

        {/* Right Column (40%) */}
        <div className="md:w-[40%] w-full">
          {sectionOrder.sections[pageIndex]?.column2.map((sectionName) => {
            if (sectionName !== "basics" && sectionName !== "profiles") {
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
