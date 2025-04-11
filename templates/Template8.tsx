"use client";

import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { ResumeData, Basics } from "@/types/types";
import { SocialIcon } from "react-social-icons";
import HTMLViewer from "@/components/HTMLViewer";
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
}> = ({ name, url, separateLinks, className }) => {
  return !separateLinks && isUrl(url.href) ? (
    <div className="flex gap-1 items-center flex-wrap">
      <div className={className}>{name}</div>
      <div className="flex items-center gap-1">
        {url.label ? "|" : ""}
        <Link
          url={url}
          label={url.label}
          icon={
            <i
              className="ph ph-bold ph-globe"
              style={{ color: "currentColor" }}
            />
          }
          iconOnRight={true}
          className={`text-baseline` + className}
        />
      </div>
    </div>
  ) : (
    <div className={className}>{name}</div>
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

  //console.log(title, isRightColumn);

  return (
    <section
      className="mb-4  pt-4 "
      style={
        isSeparator
          ? { borderTop: `1px solid ${isRightColumn ? baseColor : "white"}` }
          : undefined
      }
    >
      <h3
        className="mb-2 text-base font-bold uppercase"
        style={{ color: isRightColumn ? baseColor : "white" }}
      >
        {title}
      </h3>
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
}> = ({ basics, baseColor, fontSize, lineHeight }) => {
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
      fontSize: "3em",
      fontWeight: "bold",
      marginBottom: "",
      lineHeight: 1,
    },
    headline: {
      fontSize: "1.8em",
      marginBottom: "",
      lineHeight: 1.4,
      color: "inherit",
    },
    details: {
      fontSize: "1.1em",
      lineHeight: 1.6,
    },
  };

  return (
    <div style={styles.container} className="flex mb-4">
      <div className="w-full">
        <h2 style={styles.name} className="tracking-wider">
          {basics?.name}
        </h2>
        <p style={styles.headline}>{basics?.headLine}</p>
        <div
          style={styles.details}
          className="flex flex-wrap items-center gap-x-4"
        >
          {basics?.location && (
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-map-pin" />
              <div>{basics.location}</div>
            </div>
          )}
          {basics?.phone && (
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-phone" />
              <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                {basics.phone}
              </a>
            </div>
          )}
          {basics?.email && (
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-at" />
              <a
                href={`mailto:${basics.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics.email}
              </a>
            </div>
          )}
          {isUrl(basics?.url?.href) && <Link url={basics.url!} />}
        </div>
      </div>
    </div>
  );
};

const Template8: React.FC<TemplateProps> = ({
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
  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black",
      height: "100%",
      display: "flex",
      overflow: "hidden",
    },
    body: {
      fontSize: `${1.1 * (fontSize / 16)}rem`,
      color: "black",
    },
    sidebar: {
      backgroundColor: baseColor,
      color: "white",
      padding: `${margin}mm 5mm ${margin}mm ${margin}mm`,
      width: "40%",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column" as "column",
    },
    mainContent: {
      padding: `${margin}mm ${margin}mm  ${margin}mm 5mm`,
      width: "60%",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column" as "column",
    },
    subtitle: {
      fontWeight: "bold",
      textAlign: "left",
    },
    normal: {
      textAlign: "left",
    },
    undertitle: {
      fontWeight: "semibold",
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
    smallColumn: {
      fontSize: "0.8em",
    },
  };
  const renderSection = (
    sectionName: string,
    isRightColumn: boolean = false
  ) => {
    const sectionStyle = isRightColumn ? { color: "white" } : styles.body;

    switch (sectionName) {
      case "summary":
        return (
          content.summary &&
          content.summary.length > 0 && (
            <Section
              title=""
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              {/* <div
                dangerouslySetInnerHTML={{ __html: content.summary[0].content }}
                style={sectionStyle}
                className="text-justify"
              /> */}
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
              title="AWARDS"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.awards.map((award, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold">{award.title}</div>
                        <div>{award.awarder}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-bold">
                          {award.date && formatDate(award.date, datetype)}
                        </div>
                      </div>
                    </div>
                    {award.summary && !isEmptyString(award.summary) && (
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={award.summary}
                      />
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
              title="PUBLICATIONS"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.publications.map((pub, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={pub.name}
                        url={pub.url}
                        separateLinks={false}
                        className="font-bold"
                      />
                      <div className="shrink-0 text-right">
                        <div className="font-bold">
                          {pub.date && formatDate(pub.date, datetype)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-1">
                      <div>{pub.publisher}</div>
                      <div className="flex items-center gap-1">
                        <div className="">{pub.publishedIn ? "|" : ""}</div>
                        <div className="flex items-center">
                          {pub.publishedIn}
                        </div>
                      </div>
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
              title="VOLUNTEER EXPERIENCE"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.volunteer.map((vol, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold">{vol.organization}</div>
                        <div>{vol.role}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div
                          className={`flex font-semibold flex-wrap ${
                            isRightColumn ? "" : "text-[0.8em]"
                          } justify-end gap-0 items-center whitespace-nowrap`}
                        >
                          {vol.startDate && (
                            <div>{formatDate(vol.startDate, datetype)}</div>
                          )}
                          {vol.endDate && (
                            <div className="flex items-center">
                              <div className="mx-1">
                                {vol.startDate && vol.endDate ? "-" : ""}
                              </div>{" "}
                              {formatDate(vol.endDate, datetype)}
                            </div>
                          )}
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
              title="REFERENCES"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.references.map((ref, index) => (
                  <div key={index} className="flex flex-wrap gap-1">
                    <div className="font-bold">{ref.name}</div>
                    {ref.phone ? <div className="">|</div> : ""}
                    <div>{ref.phone}</div>
                    {ref.email ? <div className="">|</div> : ""}
                    <div>{ref.email}</div>
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
              title="EXPERIENCE"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold">{exp.organization}</div>
                        <div>{exp.role}</div>
                      </div>
                      <div className=" text-right">
                        <div
                          style={styles.subtitle}
                          className={`flex flex-wrap ${
                            isRightColumn ? "" : "text-[0.8em]"
                          } justify-end gap-0 items-center whitespace-nowrap`}
                        >
                          {exp.startDate && (
                            <div>{formatDate(exp.startDate, datetype)}</div>
                          )}
                          {exp.endDate && (
                            <div className="flex items-center">
                              <div className="mx-1">
                                {exp.startDate && exp.endDate ? "-" : ""}
                              </div>{" "}
                              {formatDate(exp.endDate, datetype)}
                            </div>
                          )}
                        </div>
                        <div style={styles.undertitle}>{exp.location}</div>
                      </div>
                    </div>
                    {exp.summary && !isEmptyString(exp.summary) && (
                      // <div
                      //   dangerouslySetInnerHTML={{ __html: exp.summary }}
                      //   style={sectionStyle}
                      //   className="text-justify"
                      // />
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={exp.summary}
                      />
                    )}
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
              title="SKILLS"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.skills.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="font-bold">{category.name}</div>
                    <div>
                      {category.skills
                        .map((skill) =>
                          skill.level && skill.level.trim() !== ""
                            ? `${skill.name} (${skill.level})`
                            : skill.name
                        )
                        .join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "profiles":
        return (
          content.profiles &&
          content.profiles.length > 0 && (
            <Section
              title="PROFILES"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="flex flex-wrap items-center gap-2">
                {content.profiles.map((profile, index) => (
                  <div className="flex gap-2 items-center" key={index}>
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
                      className="no-underline text-sm"
                    >
                      {profile.url.label}
                    </a>
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
              title="LANGUAGES"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>{lang.name}</span>
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
              title="EDUCATION"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.education.map((edu, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 text-wrap" style={styles.subtitle}>
                        {edu.institution}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap text-nowrap">
                        <div>{edu.degree}</div>
                        {edu.field ? "|" : ""}
                        <div className="">{edu.field}</div>
                        {edu.specialization ? "|" : ""}
                        <div className="">{edu.specialization}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        className={`flex flex-wrap ${
                          isRightColumn ? "" : "text-[0.8em]"
                        } justify-end items-center whitespace-nowrap`}
                      >
                        {edu.startDate && (
                          <div>{formatDate(edu.startDate, datetype)}</div>
                        )}
                        {edu.endDate && (
                          <div className="flex items-center">
                            <div className="">
                              {edu.startDate && edu.endDate ? "-" : ""}
                            </div>{" "}
                            {formatDate(edu.endDate, datetype)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">{edu.score}</div>
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
              title="CERTIFICATIONS"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-2">
                {content.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={`flex flex-wrap justify-between ${
                      isRightColumn ? "" : "relative"
                    }`}
                  >
                    <LinkedEntity
                      name={cert.name}
                      url={cert.url}
                      separateLinks={false}
                      className="font-bold"
                    />
                    <div
                      className={`${
                        isRightColumn ? "" : "absolute right-0 bottom-0"
                      }`}
                    >
                      {cert.date && formatDate(cert.date, datetype)}
                    </div>
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
              title="PROJECTS"
              baseColor={baseColor}
              isRightColumn={isRightColumn}
            >
              <div className="space-y-4">
                {content.projects.map((project, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={project.name}
                        url={project.url}
                        separateLinks={false}
                        className="font-bold"
                      />
                      <div
                        className={`flex flex-wrap ${
                          isRightColumn ? "" : "text-[0.8em]"
                        } justify-end gap-0 items-center whitespace-nowrap`}
                        style={styles.subtitle}
                      >
                        {project.startDate && (
                          <div>{formatDate(project.startDate, datetype)}</div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center">
                            <div className="mx-1">
                              {project.startDate && project.endDate ? "-" : ""}
                            </div>{" "}
                            {formatDate(project.endDate, datetype)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="">
                      {project.keywords.length - 1 > 0 &&
                      project.keywords[0] != "" ? (
                        <div className="flex flex-wrap">
                          <p
                            className="mr-1 font-medium"
                            style={styles.subtitle}
                          >
                            Skills:
                          </p>
                          {project.keywords.map((keyword, keywordIndex) => (
                            <span key={keywordIndex}>
                              {keyword}
                              {keywordIndex !== project.keywords.length - 1
                                ? ", "
                                : undefined}
                            </span>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="">
                      {project.summary && !isEmptyString(project.summary) && (
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={project.summary}
                        />
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
            title={sectionName.toUpperCase()}
            baseColor={baseColor}
            isRightColumn={isRightColumn}
          >
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
                        <div className="flex items-center flex-wrap">
                          {/* Name */}
                          {sec.name && (
                            <p style={styles.subtitle}>{sec.name}</p>
                          )}
                          {sec.location && (
                            <span className="" style={styles.undertitle}>
                              , {sec.location}
                            </span>
                          )}
                          {/* URL Link */}
                          {sec.url && (
                            <LinkedEntity
                              name={""}
                              url={sec.url}
                              separateLinks={false}
                              className="font-bold"
                            />
                          )}
                        </div>

                        {/* Right Section: Dates */}
                        <div className="">
                          {/* Start Date and End Date */}
                          <div
                            className={`flex flex-wrap ${
                              isRightColumn ? "" : "text-[0.8em]"
                            } justify-end gap-0 items-center whitespace-nowrap`}
                            style={styles.subtitle}
                          >
                            {sec.startDate && (
                              <div>{formatDate(sec.startDate, datetype)}</div>
                            )}
                            {sec.endDate && (
                              <div className="flex items-center">
                                <div className="mx-1">
                                  {sec.startDate && sec.endDate ? "-" : ""}
                                </div>{" "}
                                {formatDate(sec.endDate, datetype)}
                              </div>
                            )}
                          </div>
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
          </Section>
        );
    }
  };

  //console.log(sectionOrder.sections[0].column1)

  return (
    <div className="resume-content" style={styles.container}>
      <style>{`
        .resume-content, .resume-content * {
          font-family: ${fontFamily}, sans-serif !important;
        }
      `}</style>

      <div className="" style={styles.sidebar}>
        <div className="overflow-hidden">
          {sectionOrder.sections.length > 0 &&
            sectionOrder?.sections[pageIndex]?.column1.map(
              (sectionName: string) => renderSection(sectionName)
            )}
        </div>
      </div>

      <div className="" style={styles.mainContent}>
        <div className="overflow-hidden">
          {sectionOrder.sections[pageIndex]?.column2.map(
            (sectionName: string) => renderSection(sectionName, true)
          )}
        </div>
      </div>
    </div>
  );
};

export default Template8;
