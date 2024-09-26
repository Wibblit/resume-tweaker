import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ResumeData } from "@/types/types";
import { isEmptyString, isUrl } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/hooks";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";

interface TemplateProps {
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  content: ResumeData;
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
    <div className="flex items-center gap-x-1">
      {!iconOnRight && (icon ?? <i className="ph ph-bold ph-link" style={{ color: 'currentColor' }} />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block underline", className)}
        style={{ color: 'currentColor' }}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight && (icon ?? <i className="ph ph-bold ph-link" style={{ color: 'currentColor' }} />)}
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
      icon={<i className="ph ph-bold ph-globe" style={{ color: 'currentColor' }} />}
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
}> = ({ title, children, baseColor }) => {
  return (
    <section className="grid grid-cols-5 pt-4 mt-4" style={{ borderTop: '1px solid #d1d5db' }}>
      <div className="col-span-5 mb-2 sm:col-span-1">
        <h2 className="text-xl font-bold" style={{ color: baseColor }}>{title}</h2>
      </div>
      <div className="col-span-5 sm:col-span-4">{children}</div>
    </section>
  );
};

const Template1: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UpdateBaseColor("#000000"))
  }, [])

  const basics = content.basics[0] || {};

  const scaleFactor = fontSize / 16; // Base scale factor

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black", // Default text color
      padding: `${margin}mm`,
      height: "100%",
    },
    name: {
      fontSize: `${2.2 * scaleFactor}rem`,
      fontWeight: "bold",
      color: baseColor,
    },
    headline: {
      fontSize: `${1.3 * scaleFactor}rem`,
      color: "black",
    },
    sectionTitle: {
      fontSize: `${1.6 * scaleFactor}rem`,
      fontWeight: "bold",
      color: baseColor,
    },
    subtitle: {
      fontSize: `${1.2 * scaleFactor}rem`,
      fontWeight: "bold",
      color: "black",
    },
    body: {
      fontSize: `${1.1 * scaleFactor}rem`,
      color: "black",
    },
  };

  return (
    <div style={styles.container}>
      <div className="space-y-4">
        <header className="text-center w-full">
          <h1 style={styles.name}>{basics.name}</h1>
          <p style={styles.headline} className="mt-1">{basics.headLine}</p>
          <div className="mt-2 flex justify-between items-center space-x-3" style={{ ...styles.body, color: baseColor }}>
            {basics.location && (
              <div className="flex items-center">
                <i className="ph ph-bold ph-map-pin mr-1" />
                <span>{basics.location}</span>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-center">
                <i className="ph ph-bold ph-phone mr-1" />
                <a href={`tel:${basics.phone}`} className="underline">
                  {basics.phone}
                </a>
              </div>
            )}
            {basics.email && (
              <div className="flex items-center">
                <i className="ph ph-bold ph-at mr-1" />
                <a href={`mailto:${basics.email}`} className="underline">
                  {basics.email}
                </a>
              </div>
            )}
            <Link url={basics.url} />
          </div>
        </header>

        <div className="space-y-4">
          {content.summary && content.summary.length > 0 && (
            <Section title="Summary" baseColor={baseColor}>
              <div
                dangerouslySetInnerHTML={{ __html: content.summary[0].content }}
                style={styles.body}
                className="text-justify"
              />
            </Section>
          )}

          {content.experience && content.experience.length > 0 && (
            <Section title="Experience" baseColor={baseColor}>
              <div className="space-y-4">
                {content.experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col justify-between sm:flex-row">
                      <div>
                        <h3 style={styles.subtitle}>{exp.organization}</h3>
                        <p style={styles.body}>{exp.role}</p>
                      </div>
                      <div className="text-right">
                        <p style={styles.body}>{`${exp.startDate} - ${exp.endDate}`}</p>
                        <p style={styles.body}>{exp.location}</p>
                      </div>
                    </div>
                    {exp.summary && !isEmptyString(exp.summary) && (
                      <div
                        dangerouslySetInnerHTML={{ __html: exp.summary }}
                        style={styles.body}
                        className="text-justify"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.education && content.education.length > 0 && (
            <Section title="Education" baseColor={baseColor}>
              <div className="space-y-4">
                {content.education.map((edu, index) => (
                  <div key={index} className="flex flex-col justify-between sm:flex-row">
                    <div>
                      <h3 style={styles.subtitle}>{edu.institution}</h3>
                      <p style={styles.body}>{edu.field}</p>
                      <p style={styles.body}>{edu.score}</p>
                    </div>
                    <div className="text-right">
                      <p style={styles.body}>{`${edu.startDate} - ${edu.endDate}`}</p>
                      <p style={styles.body}>{edu.degree}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.skills && content.skills.length > 0 && content.skills[0].categories && (
            <Section title="Skills" baseColor={baseColor}>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.skills[0].categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <h3 style={styles.subtitle}>{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="rounded-full px-3 py-1"
                          style={{ ...styles.body, backgroundColor: `${baseColor}20`, color: baseColor }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.projects && content.projects.length > 0 && (
            <Section title="Projects" baseColor={baseColor}>
              <div className="space-y-4">
                {content.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col justify-between sm:flex-row">
                      <h3 style={styles.subtitle}>
                        <LinkedEntity
                          name={project.name}
                          url={project.url}
                          separateLinks={false}
                        />
                      </h3>
                      <p style={styles.body}>{`${project.startDate} - ${project.endDate}`}</p>
                    </div>
                    {project.summary && !isEmptyString(project.summary) && (
                      <div
                        dangerouslySetInnerHTML={{ __html: project.summary }}
                        style={styles.body}
                        className="text-justify"
                      />
                    )}
                    {project.keywords && project.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.keywords.map((keyword, keywordIndex) => (
                          <span
                            key={keywordIndex}
                            className="rounded-full px-3 py-1"
                            style={{ ...styles.body, backgroundColor: `${baseColor}20`, color: baseColor }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.certifications && content.certifications.length > 0 && (
            <Section title="Certifications" baseColor={baseColor}>
              <div className="space-y-2">
                {content.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <LinkedEntity
                      name={cert.name}
                      url={cert.url}
                      separateLinks={false}
                      className="font-semibold"
                    />
                    <p style={styles.body}>{cert.date}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {content.languages && content.languages.length > 0 && (
            <Section title="Languages" baseColor={baseColor}>
              <div className="flex flex-wrap gap-4">
                {content.languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span style={styles.subtitle}>{lang.name}:</span>
                    <span style={styles.body}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template1;