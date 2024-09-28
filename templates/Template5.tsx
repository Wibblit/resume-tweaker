import React, { useEffect } from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ResumeData, Basics, Profile } from "@/types/types";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";
import { color } from "framer-motion";

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
      {!iconOnRight && (icon ?? <i className="ph ph-bold ph-link" style={{ color: 'currentColor' }} />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
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
  isRightColumn?: boolean;
}> = ({ title, children, baseColor, isRightColumn }) => {
  return (
    <section className="mt-4 pt-4" style={{ borderTop: `1px solid ${isRightColumn ? 'white' : baseColor}` }}>
      <h4 className="mb-2 text-base font-bold uppercase" style={{ color: isRightColumn ? 'white' : baseColor }}>{title}</h4>
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

const Profiles: React.FC<{profiles: Profile[]; baseColor: string; fontSize: number; lineHeight: number; margin: number}> = ({ profiles, baseColor, fontSize, lineHeight, margin }) => {
  const styles = {
    container: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      color: "black",
      background: baseColor,
      opacity: 0.4,  
    },
  }
  
  return (
    <div style={styles.container}>
        {profiles.length > 0 && profiles.map((profile, index) => (
          <Link
          key={index}
          url={profile.url}
          className="text-sm text-black"
        />
        ))}
    </div>
  )
}

const Header: React.FC<{ basics: Basics; baseColor: string; fontSize: number; lineHeight: number; margin: number }> = ({ basics, baseColor, fontSize, lineHeight, margin }) => {

  const scaleFactor = fontSize / 16;
  const imageSize = 128; // 8rem = 128px
  const contentWidth = `calc(100% - ${imageSize}px - 1rem)`; // Subtracting image width and gap

  const styles = {
    container: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      background: baseColor,
    },
    content: {
      width: contentWidth,
    },
    name: {
      fontSize: `${Math.max(2, imageSize / 64) * scaleFactor}rem`,
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      lineHeight: 1.2,
    },
    headline: {
      fontSize: `${Math.max(1.2, imageSize / 96) * scaleFactor}rem`,
      marginBottom: '1rem',
      color: 'white',
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
        <div style={styles.details} className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                {basics.email}
              </a>
            </div>
          )}
          {isUrl(basics?.url?.href) && (
            <Link url={basics.url!} />
          )}
        </div>
      </div>
      <Picture 
        src={typeof basics?.picture === 'string' && basics?.picture !== "" ? basics?.picture : "/placeholder-user.jpeg"} 
        alt={basics?.name || "Profile picture"} 
      />
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
}) => {
  const dispatch = useAppDispatch();
  const sectionOrder = useAppSelector((state) => state.rightsidebar.sectionOrder);
  const scaleFactor = fontSize / 16;

  useEffect(() => {
    dispatch(UpdateBaseColor("#57534e"));
  }, [dispatch]);

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "white",
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
      color: 'white',
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
  const renderSection = (sectionName: string, isRightColumn: boolean = false) => {
    const sectionStyle = isRightColumn ? { color: 'white' } : styles.body;

    switch (sectionName) {
      case 'summary':
        return content.summary && content.summary.length > 0 && (
          <Section title="Summary" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div
              dangerouslySetInnerHTML={{ __html: content.summary[0].content }}
              style={sectionStyle}
              className="text-justify"
            />
          </Section>
        );
      case 'experience':
        return content.experience && content.experience.length > 0 && (
          <Section title="Experience" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div className="space-y-4">
              {content.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{exp.organization}</div>
                      <div>{exp.role}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div>{`${exp.startDate} - ${exp.endDate}`}</div>
                      <div>{exp.location}</div>
                    </div>
                  </div>
                  {exp.summary && !isEmptyString(exp.summary) && (
                    <div
                      dangerouslySetInnerHTML={{ __html: exp.summary }}
                      style={sectionStyle}
                      className="text-justify"
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>
        );
      case 'skills':
        return content.skills && content.skills.length > 0 && content.skills[0].categories && (
          <Section title="Skills" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div className="space-y-4">
              {content.skills[0].categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-bold">{category.name}</div>
                  <div>{category.skills.map(skill => skill.name).join(', ')}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'languages':
        return content.languages && content.languages.length > 0 && (
          <Section title="Languages" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div className="space-y-2">
              {content.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{lang.name}</span>
                  <span>{lang.level}</span>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'education':
        return content.education && content.education.length > 0 && (
          <Section title="Education" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <div className="font-bold">{edu.institution}</div>
                    <div>{edu.field}</div>
                    <div>{edu.score}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div>{`${edu.startDate} - ${edu.endDate}`}</div>
                    <div>{edu.degree}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'certifications':
        return content.certifications && content.certifications.length > 0 && (
          <Section title="Certifications" baseColor={baseColor} isRightColumn={isRightColumn}>
            <div className="space-y-2">
              {content.certifications.map((cert, index) => (
                <div key={index}>
                  <LinkedEntity
                    name={cert.name}
                    url={cert.url}
                    separateLinks={false}
                    className="font-bold"
                  />
                  <div>{cert.date}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'projects':
        return content.projects && content.projects.length > 0 && (
          <Section title="Projects" baseColor={baseColor} isRightColumn={isRightColumn}>
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
                      <div>{`${project.startDate} - ${project.endDate}`}</div>
                    </div>
                  </div>
                  {project.summary && !isEmptyString(project.summary) && (
                    <div
                      dangerouslySetInnerHTML={{ __html: project.summary }}
                      style={sectionStyle}
                      className="text-justify"
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <Header basics={content.basics[0]} baseColor={baseColor} fontSize={fontSize} margin={margin} lineHeight={lineHeight} />
        <Profiles profiles={content.profiles} baseColor={baseColor} fontSize={fontSize} margin={margin} lineHeight={lineHeight} />
      </div>
      <div style={styles.container}>
        <div style={styles.mainContent}>
          {sectionOrder.column1.map((sectionName) => renderSection(sectionName))}
        </div>
        <div style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            {sectionOrder.column2.map((sectionName) => renderSection(sectionName, true))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Template3;