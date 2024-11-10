"use client";

import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { ResumeData, Basics } from "@/types/types";
import { SocialIcon } from "react-social-icons";
import HTMLViewer from "@/components/HTMLViewer";
import DateConverter from "@/components/DateConverter";

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
    <Link
      url={url}
      label={name}
      icon={
        <i className="ph ph-bold ph-globe" style={{ color: "currentColor" }} />
      }
      iconOnRight={true}
      className={className}
    />
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

  console.log(title, isRightColumn);

  return (
    <section
      className="mb-4  pt-4 "
      style={
        isSeparator
          ? { borderTop: `1px solid ${isRightColumn ? baseColor : "white" }` }
          : undefined
      }
    >
      <h4
        className="mb-2 text-base font-bold uppercase"
        style={{ color: isRightColumn ? baseColor : "white"  }}
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
      fontSize: `${Math.max(2, imageSize / 38) * scaleFactor}rem`,
      fontWeight: "bold",
      marginBottom: "",
      lineHeight: 1.2,
    },
    headline: {
      fontSize: `${Math.max(1.2, imageSize / 64) * scaleFactor}rem`,
      marginBottom: "",
      lineHeight: 1.4,
      color : "inherit"
    },
    details: {
      fontSize: `${Math.max(1, imageSize / 128) * scaleFactor}rem`,
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
      width: "40%",
      color: "white",
      padding: `${margin}mm`,
    },
    sidebarContent: {
      padding: `${margin}mm`,
      height: "100%",
    },
    mainContent: {
      width: "60%",
      padding: `${margin}mm`,
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
              <HTMLViewer
                lineHeight={lineHeight}
                content={content.summary[0].content}
              />
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
                          {award.date && DateConverter(award.date)}
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
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={pub.name}
                        url={pub.url}
                        separateLinks={false}
                        className="font-bold"
                      />
                      <div className="shrink-0 text-right">
                        <div className="font-bold">
                          {pub.date && DateConverter(pub.date)}
                        </div>
                      </div>
                    </div>
                    <div>{pub.publisher}</div>
                    <div>{pub.publishedIn}</div>
                  </div>
                ))}
              </div>
            </Section>
          )
        );
      case "volunteerings":
        console.log(content.volunteer);
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
                        <div className="font-bold">
                          {vol.startDate && DateConverter(vol.startDate)}{" "}
                          {vol.endDate && " - "}{" "}
                          {vol.endDate && DateConverter(vol.endDate)}
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
                  <div key={index} className="space-y-2">
                    <div className="font-bold">{ref.name}</div>
                    <div>{ref.phone}</div>
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
                      <div className="shrink-0 text-right">
                        <div>
                          {exp.startDate && DateConverter(exp.startDate)}{" "}
                          {exp.endDate && " - "}{" "}
                          {exp.endDate && DateConverter(exp.endDate)}
                        </div>
                        <div>{exp.location}</div>
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
                      {category.skills.map((skill) => skill.name).join(", ")}
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
                        url={profile.url.href}
                      />
                    )}
                    <a
                      href={profile.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-sm"
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
                      <div className="font-bold">{edu.institution}</div>
                      <div>{edu.field}</div>
                      <div>{edu.score}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div>
                        {edu.startDate && DateConverter(edu.startDate)}{" "}
                        {edu.endDate && " - "}{" "}
                        {edu.endDate && DateConverter(edu.endDate)}{" "}
                      </div>
                      <div>{edu.degree}</div>
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
                  <div key={index}>
                    <LinkedEntity
                      name={cert.name}
                      url={cert.url}
                      separateLinks={false}
                      className="font-bold"
                    />
                    <div>{cert.date && DateConverter(cert.date)}</div>
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
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={project.name}
                        url={project.url}
                        separateLinks={false}
                        className="font-bold"
                      />
                      <div className="shrink-0 text-right">
                        <div>
                          {project.startDate &&
                            DateConverter(project.startDate)}{" "}
                          {project.endDate && " - "}{" "}
                          {project.endDate && DateConverter(project.endDate)}
                        </div>
                      </div>
                    </div>
                    {project.summary && !isEmptyString(project.summary) && (
                      // <div
                      //   dangerouslySetInnerHTML={{ __html: project.summary }}
                      //   style={sectionStyle}
                      //   className="text-justify"
                      // />
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={project.summary}
                      />
                    )}
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
        return null;
    }
  };

  console.log(sectionOrder.sections[0].column1)

  return (
    <div className="resume-content" style={styles.container}>
      <style>{`
        .resume-content, .resume-content * {
          font-family: ${fontFamily}, sans-serif !important;
        }
           p {
          color:black
          }
      `}</style>

      <div className="w-4/12" style={styles.sidebar}>
        {sectionOrder.sections.length > 0 &&
          sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
            renderSection(sectionName)
          )}
      </div>

      <div style={styles.mainContent}>
        {sectionOrder.sections[pageIndex]?.column2.map((sectionName) =>
          renderSection(sectionName, true)
        )}
      </div>
    </div>
  );
};

export default Template3;
