import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector } from "@/hooks/hooks";
import { ResumeData, Basics, Profile } from "@/types/types";
import HTMLViewer from "@/components/HTMLViewer";
import { SocialIcon } from "react-social-icons";
import DateConverter from "@/components/DateConverter";

interface TemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
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
  const isSeparator = useAppSelector((state) => state?.rightsidebar?.separator);

  return (
    <section
      className="mt-4 pt-4"
      style={
        isSeparator
          ? { borderTop: `1px solid ${isRightColumn ? "white" : baseColor}` }
          : undefined
      }
    >
      <h4
        className="mb-2 text-base font-bold uppercase"
        style={{ color: isRightColumn ? "white" : baseColor }}
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

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Profiles: React.FC<{
  profiles: Profile[];
  baseColor: string;
  fontSize: number;
  lineHeight: number;
  margin: number;
}> = ({ profiles, baseColor, fontSize, lineHeight, margin }) => {
  const styles = {
    container: {
      fontSize: `${fontSize}px`,
      color: "black",
      background: hexToRgba(baseColor, 0.4),
    },
    link: {
      color: "#000000",
      textDecoration: "none",
    },
    dot: {
      margin: "0 8px",
    },
  };

  const isIcons = useAppSelector((state) => state?.rightsidebar?.icons);

  return (
    <div
      style={styles.container}
      className="flex flex-wrap justify-center space-x-4 py-2"
    >
      {profiles.map((profile, index) => (
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
  );
};

const Header: React.FC<{
  basics: Basics;
  baseColor: string;
  fontSize: number;
  lineHeight: number;
  margin: number;
}> = ({ basics, baseColor, fontSize, lineHeight, margin }) => {
  const scaleFactor = fontSize / 16;
  const imageSize = 128;
  const contentWidth = `calc(100% - ${imageSize}px - 1rem)`;

  const styles = {
    container: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      background: baseColor,
      color: "#ffffff",
    },
    content: {
      width: contentWidth,
    },
    name: {
      fontSize: `${Math.max(2, imageSize / 64) * scaleFactor}rem`,
      fontWeight: "bold",
      marginBottom: "0.5rem",
      lineHeight: 1.2,
    },
    headline: {
      fontSize: `${Math.max(1.2, imageSize / 96) * scaleFactor}rem`,
      marginBottom: "1rem",
      color: "white",
      lineHeight: 1.4,
    },
    details: {
      fontSize: `${Math.max(1, imageSize / 128) * scaleFactor}rem`,
      lineHeight: 1.6,
    },
  };

  return (
    <div style={styles.container} className="flex items-center gap-4">
      <div style={styles.content}>
        <h2 style={styles.name}>{basics?.name}</h2>
        <p style={styles.headline}>{basics?.headLine}</p>
        <div
          style={styles.details}
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
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
      <Picture
        src={
          typeof basics?.picture === "string" && basics?.picture !== ""
            ? basics?.picture
            : "/placeholder-user.jpeg"
        }
        alt={basics?.name || "Profile picture"}
      />
    </div>
  );
};

const Template5: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const scaleFactor = fontSize / 16;

  const styles = {
    container: {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      minHeight: "100vh",
      height: "100%",
      display: "flex",
    },
    body: {
      fontSize: `${1.1 * scaleFactor}rem`,
      color: "black",
    },
    sidebar: {
      width: "50%",
      height: "100%",
      color: "black",
    },
    sidebarContent: {
      padding: `${margin}mm`,
      height: "100%",
      overflowY: "auto" as const,
    },
    mainContent: {
      padding: `${margin}mm`,
      width: "50%",
    },
  };

  const renderSection = (
    sectionName: string,
    isRightColumn: boolean = false
  ) => {
    const sectionStyle = styles.body;

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
      case "publications":
        return (
          content.publications &&
          content.publications.length > 0 && (
            <Section
              title="Publications"
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
              title="Volunteer Experience"
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
                        <div className="font-bold">{`${
                          vol.startDate && DateConverter(vol.startDate)
                        } ${vol.endDate && " - "} ${
                          vol.endDate && DateConverter(vol.endDate)
                        }`}</div>
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
      case "experience":
        return (
          content.experience &&
          content.experience.length > 0 && (
            <Section
              title="Experience"
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
                        <div>{`${
                          exp.startDate && DateConverter(exp.startDate)
                        } - ${exp.endDate && DateConverter(exp.endDate)}`}</div>
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
          content.skills.length > 0 &&(
            <Section
              title="Skills"
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
              title="Education"
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
                      <div>{`${
                        edu.startDate && DateConverter(edu.startDate)
                      } - ${edu.endDate && DateConverter(edu.endDate)}`}</div>
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
              title="Certifications"
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
                    <div>{cert.date && DateConverter(cert.date)} </div>
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
                        <div>{`${
                          project.startDate && DateConverter(project.startDate)
                        } - ${
                          project.endDate && DateConverter(project.endDate)
                        }`}</div>
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
      default:
        return null;
    }
  };

  return (
    <div className="resume-content">
      <style>{`
        .resume-content, .resume-content * {
          font-family: ${fontFamily}, sans-serif !important;
        }
      `}</style>
      <div>
        <Header
          basics={content.basics[0]}
          baseColor={baseColor}
          fontSize={fontSize}
          margin={margin}
          lineHeight={lineHeight}
        />
        <Profiles
          profiles={content.profiles}
          baseColor={baseColor}
          fontSize={fontSize}
          margin={margin}
          lineHeight={lineHeight}
        />
      </div>
      <div style={styles.container}>
        <div style={styles.mainContent}>
          <style>{`
            p {
              white-space: pre-wrap; 
              word-wrap: break-word; 
              overflow-wrap: break-word;
              text-align: justify;
            }
          `}</style>
          {sectionOrder.column1.map((sectionName) =>
            renderSection(sectionName)
          )}
        </div>
        <div style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            {sectionOrder.column2.map((sectionName) =>
              renderSection(sectionName)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template5;