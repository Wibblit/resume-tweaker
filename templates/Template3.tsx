"use client";

import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { ResumeData, Basics } from "@/types/types";
import { SocialIcon } from "react-social-icons";
import HTMLViewer from "@/components/HTMLViewer";
import Base64Image from "@/components/base64toPhoto";
import { formatDate } from "@/utils/formatDate";

interface TemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  pageIndex: number;
}

const Link: React.FC<{
  url: { href: string; label: string };
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
}> = ({ url, icon, iconOnRight, label, className }) => {
  if (!isUrl(url?.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight &&
        (icon ?? (
          <i className="ph ph-bold ph-link" style={{ color: "currentColor" }} />
        ))}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
        style={{ color: "currentColor" }}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight &&
        (icon ?? (
          <i className="ph ph-bold ph-link" style={{ color: "currentColor" }} />
        ))}
    </div>
  );
};

const LinkedEntity: React.FC<{
  name: string;
  url: { href: string; label: string };
  separateLinks: boolean;
  className?: string;
  isRightColumn: boolean;
}> = ({ name, url, separateLinks, className, isRightColumn }) => {
  const baseColor = useAppSelector((state) => state?.rightsidebar?.baseColor);
  const fontSize = useAppSelector((state) => state?.rightsidebar?.fontSize);

  return (
    <div className="flex items-center">
      <h3
        style={{ fontSize: fontSize + Math.floor(fontSize * 0.2) }}
        className="font-bold"
      >
        {name}
      </h3>
      {name && url.label && <span className="mx-1">|</span>}
      <a
        style={{ color: isRightColumn ? "white" : baseColor }}
        href={url.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url.label}
      </a>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  baseColor: string;
  isRightColumn?: boolean;
}> = ({ title, children, baseColor, isRightColumn }) => {
  const isSeparator: boolean = useAppSelector(
    (state) => state.rightsidebar.separator
  );

  const fontSize = useAppSelector((state) => state?.rightsidebar?.fontSize);

  //console.log(title, isRightColumn);

  return (
    <section
      className="mt-2 pb-2 pt-2"
      style={
        isSeparator
          ? { borderTop: `1px solid ${isRightColumn ? "white" : baseColor}` }
          : undefined
      }
    >
      <h4
        className="mb-1  font-bold uppercase"
        style={{
          color: isRightColumn ? "white" : baseColor,
          fontSize: fontSize + Math.floor(fontSize * 0.4),
        }}
      >
        {title}
      </h4>
      <div>{children}</div>
    </section>
  );
};

const Picture: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

const Header: React.FC<{
  basics: Basics;
  baseColor: string;
  fontSize: number;
  lineHeight: number;
  content: ResumeData;
}> = ({ basics, baseColor, fontSize, lineHeight, content }) => {
  const scaleFactor = fontSize / 16;
  const imageSize = 128; // 8rem = 128px
  const contentWidth = `calc(100% - ${imageSize}px - 1rem)`; // Subtracting image width and gap

  const styles = {
    container: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
    },
    content: {
      width: contentWidth,
    },
    name: {
      fontSize: `2em`,
      fontWeight: "bold",
      lineHeight: 1.2,
    },
    headline: {
      fontSize: `1.1em`,
      color: baseColor,
      lineHeight: 1.4,
    },
    details: {
      fontSize: `1.1em`,
      lineHeight: 1.6,
    },
  };

  const isIcons: boolean = useAppSelector(
    (state) => state?.rightsidebar?.icons
  );

  return (
    <div style={styles.container} className="flex items-center gap-4 mb-2">
      {basics.picture ? (
        <img
          src={basics?.picture}
          alt={basics?.name}
          width={112}
          height={112}
        />
      ) : (
        <Picture
          src={
            typeof basics?.picture === "string" && basics?.picture !== ""
              ? basics?.picture
              : "/placeholder-user.jpeg"
          }
          alt={basics?.name || "Profile picture"}
        />
      )}

      <div style={styles.content}>
        <h2 style={styles.name}>{basics?.name}</h2>
        <p style={styles.headline}>{basics?.headLine}</p>
        <div style={styles.details} className="flex flex-wrap items-center">
          {basics?.location && (
            <div className="flex items-center">
              <i className="ph ph-bold ph-map-pin" />
              <div>{basics.location}</div>
              {((basics.location && basics.email) ||
                (basics.location && basics.phone) ||
                (basics.location && basics.url.label)) && (
                <span className="mx-1">|</span>
              )}
            </div>
          )}
          {basics?.phone && (
            <div className="flex items-center">
              <i className="ph ph-bold ph-phone" />
              <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                {basics.phone}
              </a>
              {((basics.phone && basics.email) ||
                (basics.phone && basics.location) ||
                (basics.phone && basics.url.label)) && (
                <span className="mx-1">|</span>
              )}
            </div>
          )}
          {basics?.email && (
            <div className="flex items-center">
              <i className="ph ph-bold ph-at" />
              <a
                href={`mailto:${basics.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics.email}
              </a>
              {((basics.email && basics.phone) ||
                (basics.email && basics.location) ||
                (basics.email && basics.url.label)) && (
                <span className="mx-1">|</span>
              )}
            </div>
          )}
          {isUrl(basics?.url?.href) && <Link url={basics.url!} />}
        </div>
        <div className="flex flex-wrap items-center justify-start mt-1 gap-2">
          {
            //@ts-ignore
            content.profiles.map((profile, index) => (
              <a
                key={index}
                href={profile.url.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {isIcons && profile.url.href !== "" && (
                  <SocialIcon
                    style={{ width: "16px", height: "16px" }}
                    fgColor={"white"}
                    bgColor={"black"}
                    url={profile.url.href}
                  />
                )}
                <span className="no-underline ">
                  {profile.url.label}
                </span>
              </a>
            ))
          }
        </div>
      </div>
    </div>
  );
};

const Template3: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}) => {
  const dispatch = useAppDispatch();
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const isIcons: boolean = useAppSelector(
    (state) => state?.rightsidebar?.icons
  );

  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);

  const styles = {
    container: {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black",
      minHeight: "100vh",
      height: "100%",
      display: "flex",
    },
    body: {
      fontSize: `${1.1 * (fontSize / 16)}rem`,
      color: "black",
    },
    sidebar: {
      backgroundColor: baseColor,
      position: "absolute" as const,
      top: 0,
      bottom: 0,
      right: 0,
      width: "35%",
      color: "white",
    },
    sidebarContent: {
      padding: `${margin}mm`,
      height: "100%",
      overflow: "hidden",
    },
    mainContent: {
      padding: `${margin}mm`,
      width: "65%",
    },
    normal: {
      fontSize: "1.1em",
    },
  };
  const renderSection = (
    sectionName: string,
    isRightColumn: boolean = false
  ) => {
    switch (sectionName) {
      case "summary":
        return (
          content.summary &&
          content.summary.length > 0 && (
            <Section
              title="Summary"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="" style={styles.normal}>
                <HTMLViewer
                  lineHeight={lineHeight}
                  content={content.summary[0].content}
                />
              </div>
            </Section>
          )
        );
      case "awards":
        return (
          content.awards &&
          content.awards.length > 0 && (
            <Section
              title="Awards"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.awards.map((award, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center">
                        <div
                          style={{
                            fontSize: fontSize + Math.floor(fontSize * 0.1),
                          }}
                          className="font-bold"
                        >
                          {award.title}
                        </div>
                        {award.title && award.awarder && (
                          <span className="mx-1">|</span>
                        )}
                        <div>{award.awarder}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div>
                          {award.date && formatDate(award.date, datetype)}
                        </div>
                      </div>
                    </div>
                    {award.summary && !isEmptyString(award.summary) && (
                      <div className="" style={styles.normal}>
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={award.summary}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "publications":
        return (
          content.publications &&
          content.publications.length > 0 && (
            <Section
              title="Publications"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.publications.map((pub, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={pub.name}
                        url={pub.url}
                        separateLinks={false}
                        className="font-bold"
                        isRightColumn={isRightColumn}
                      />
                      <div className="shrink-0 text-right">
                        <div>{pub.date && formatDate(pub.date, datetype)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap">
                      <div>{pub.publisher}</div>
                      <div>{pub.publishedIn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "volunteer":
        //console.log(content.volunteer);
        return (
          content.volunteer &&
          content.volunteer.length > 0 && (
            <Section
              title="Volunteer Experience"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.volunteer.map((vol, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between">
                      <div>
                        <div
                          style={{
                            fontSize: fontSize + Math.floor(fontSize * 0.1),
                          }}
                          className="font-bold"
                        >
                          {vol.organization}
                        </div>
                        <div>{vol.role}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div>
                          {vol.startDate && formatDate(vol.startDate, datetype)}
                          {vol.endDate && vol.startDate && (
                            <span className="mx-1">-</span>
                          )}
                          {vol.endDate && formatDate(vol.endDate, datetype)}
                        </div>
                        <div>{vol.location}</div>
                      </div>
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
            <Section
              title="References"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.references.map((ref, index) => (
                  <div key={index} className="space-y-1">
                    <div
                      style={{
                        fontSize: fontSize + Math.floor(fontSize * 0.1),
                      }}
                      className="font-bold"
                    >
                      {ref.name}
                    </div>
                    <div className="flex space-x-4">
                      <div>{ref.phone}</div>
                      <div>{ref.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "experience":
        return (
          content.experience &&
          content.experience.length > 0 && (
            <Section
              title="Experience"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div
                          style={{
                            fontSize: fontSize + Math.floor(fontSize * 0.1),
                          }}
                          className="font-bold"
                        >
                          {exp.organization}
                        </div>
                        <em>{exp.role}</em>
                      </div>
                      <div className="shrink-0 text-right">
                        <div>
                          {exp.startDate && formatDate(exp.startDate, datetype)}{" "}
                          {exp.endDate && " - "}{" "}
                          {exp.endDate && formatDate(exp.endDate, datetype)}
                        </div>
                        <div>{exp.location}</div>
                      </div>
                    </div>
                    <div className="mt-1">
                      {exp.summary && !isEmptyString(exp.summary) && (
                        <div className="" style={styles.normal}>
                          <HTMLViewer
                            lineHeight={lineHeight}
                            content={exp.summary}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "skills":
        return (
          content.skills &&
          content.skills.length > 0 && (
            <Section
              title="Skills"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.skills.map((category, index) => (
                  <div key={index}>
                    <div
                      style={{
                        fontSize: fontSize + Math.floor(fontSize * 0.1),
                      }}
                      className="font-bold"
                    >
                      {category.name}
                    </div>
                    <div className="flex flex-wrap items-center">
                      {category.skills.map((skill) => skill.name).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "languages":
        return (
          content.languages &&
          content.languages.length > 0 && (
            <Section
              title="Languages"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span
                      style={{
                        fontSize: fontSize + Math.floor(fontSize * 0.1),
                      }}
                    >
                      {lang.name}
                    </span>
                    <span>{lang.level}</span>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "education":
        return (
          content.education &&
          content.education.length > 0 && (
            <Section
              title="Education"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2 w-full">
                {content.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex-col items-start justify-between w-full"
                  >
                    <div className="flex w-full flex-wrap items-center justify-between">
                      <div className="flex flex-wrap items-center">
                        <div
                          style={{
                            fontSize: fontSize + Math.floor(fontSize * 0.1),
                          }}
                          className="font-bold"
                        >
                          {edu.institution}
                        </div>
                        <span className="mx-1">|</span>
                        <p> {edu.degree}</p>
                      </div>
                      <div>
                        {edu.startDate && formatDate(edu.startDate, datetype)}{" "}
                        {edu.endDate && " - "}{" "}
                        {edu.endDate && formatDate(edu.endDate, datetype)}{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between">
                      <div>{edu.field}</div>
                      <div>{edu.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "certifications":
        return (
          content.certifications &&
          content.certifications.length > 0 && (
            <Section
              title="Certifications"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <LinkedEntity
                      name={cert.name}
                      url={cert.url}
                      separateLinks={false}
                      className="font-bold"
                      isRightColumn={isRightColumn}
                    />
                    <div>{cert.date && formatDate(cert.date, datetype)}</div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "projects":
        return (
          content.projects &&
          content.projects.length > 0 && (
            <Section
              title="Projects"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex flex-wrap items-start justify-between">
                      <LinkedEntity
                        name={project.name}
                        url={project.url}
                        separateLinks={false}
                        className="font-bold"
                        isRightColumn={isRightColumn}
                      />
                      <div className="shrink-0 text-right">
                        <div>
                          {project.startDate &&
                            formatDate(project.startDate, datetype)}
                          {project.endDate && project.startDate && (
                            <span className="mx-1">-</span>
                          )}
                          {project.endDate &&
                            formatDate(project.endDate, datetype)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      {project.summary && !isEmptyString(project.summary) && (
                        <div className="" style={styles.normal}>
                          <HTMLViewer
                            lineHeight={lineHeight}
                            content={project.summary}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "basics":
        return (
          content.basics && (
            <Header
              basics={content.basics[0]}
              baseColor={baseColor}
              fontSize={fontSize}
              lineHeight={lineHeight}
              content={content}
            />
          )
        );
      default:
        if (
          !content ||
          //@ts-ignore
          !Array.isArray(content[sectionName]) ||
          //@ts-ignore
          !content[sectionName]?.length
        )
          return null;
        return (
          <Section
            title={sectionName}
            baseColor={baseColor}
            isRightColumn={isRightColumn}
          >
            <div className="mb-6">
              {
                //@ts-ignore
                content[sectionName] &&
                  //@ts-ignore
                  Array.isArray(content[sectionName]) &&
                  //@ts-ignore
                  content[sectionName]?.map((sec: Custom, index: number) => (
                    <div key={index} className="mb-2">
                      <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {sec.name && (
                              <h3
                                style={{
                                  fontSize:
                                    fontSize + Math.floor(fontSize * 0.1),
                                }}
                                className="font-bold"
                              >
                                {sec.name}
                              </h3>
                            )}

                            {sec.name && sec.url.label && (
                              <span className="mx-1">|</span>
                            )}
                            {sec.location && <p>{sec.location}</p>}
                            {sec.url.label && <span className="mx-1">|</span>}
                            {sec.url && (
                              <a
                                href={sec.url.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <p style={{ color: baseColor }}>
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
                        {sec.description && <p>{sec.description}</p>}

                        {/* Summary: Placed below the description */}
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
                  ))
              }
            </div>
          </Section>
        );
    }
  };

  return (
    <div className="resume-content" style={styles.container}>
      <style>{`
        .resume-content, .resume-content * {
          font-family: ${fontFamily}, sans-serif !important;
        }
      `}</style>
      <div style={styles.mainContent}>
        {sectionOrder.sections.length > 0 &&
          sectionOrder?.sections[pageIndex]?.column1.map((sectionName) => {
            if (sectionName !== "profiles") {
              return renderSection(sectionName);
            }
          })}
      </div>
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          {sectionOrder.sections[pageIndex]?.column2.map((sectionName) => {
            if (sectionName !== "profiles") {
              return renderSection(sectionName, true);
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Template3;
