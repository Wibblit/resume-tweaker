import React, { useEffect } from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { ResumeData } from "@/types/types";
import { MapPin, Phone, AtSign, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import { useDispatch } from "react-redux";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";

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
  className?: string;
  baseColor: string;
}> = ({ url, icon, className, baseColor }) => {
  if (!isUrl(url?.href)) return null;

  return (
    <a
      href={url.href}
      target="_blank"
      rel="noreferrer noopener nofollow"
      className={cn("inline-flex items-center gap-x-1", className)}
      style={{ color: baseColor }}
    >
      {icon}
      <span>{url.label || url.href}</span>
    </a>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  baseColor: string;
}> = ({ title, children, baseColor }) => {
  return (
    <section className="mt-4">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2" style={{ color: baseColor }}>{title}</h2>
      <div>{children}</div>
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
  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black",
      padding: `${margin}mm`,
    },
    coloredText: {
      color: baseColor,
    },
    blackText: {
      color: "black",
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UpdateBaseColor("#57534e"));
  }, [dispatch]);

  const basics = content.basics?.[0] || {};

  return (
    <div style={styles.container} className="max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={styles.coloredText}>{basics.name}</h1>
        <p className="text-xl" style={styles.coloredText}>{basics.headLine}</p>
        <div className="flex justify-center items-center gap-4 mt-2">
          {basics.location && (
            <div className="flex items-center gap-1" style={styles.coloredText}>
              <MapPin size={14} />
              <span>{basics.location}</span>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-1" style={styles.coloredText}>
              <Phone size={14} />
              <a href={`tel:${basics.phone}`}>{basics.phone}</a>
            </div>
          )}
          {basics.email && (
            <div className="flex items-center gap-1" style={styles.coloredText}>
              <AtSign size={14} />
              <a href={`mailto:${basics.email}`}>{basics.email}</a>
            </div>
          )}
          {basics.url && (
            <div className="flex items-center gap-1" style={styles.coloredText}>
              <LinkIcon size={14} />
              <a href={basics.url.href} target="_blank" rel="noopener noreferrer">{basics.url.label}</a>
            </div>
          )}
        </div>
      </header>

      <Section title="Profiles" baseColor={baseColor}>
        <div className="flex gap-4">
          {content.profiles?.map((profile, index) => (
            <Link
              key={index}
              url={profile.url}
              icon={profile.url.label.toLowerCase().includes('linkedin') ? <Linkedin size={14} /> : 
                    profile.url.label.toLowerCase().includes('github') ? <Github size={14} /> :
                    <LinkIcon size={14} />}
              className="text-sm"
              baseColor={baseColor}
            />
          ))}
        </div>
      </Section>

      {content.summary && content.summary.length > 0 && (
        <Section title="Summary" baseColor={baseColor}>
          <p className="text-justify" style={styles.blackText}>{content.summary[0].content}</p>
        </Section>
      )}

      {content.experience && content.experience.length > 0 && (
        <Section title="Experience" baseColor={baseColor}>
          {content.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={styles.blackText}>{exp.organization}</h3>
                  <p style={styles.blackText}>{exp.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={styles.blackText}>{`${exp.startDate} to ${exp.endDate}`}</p>
                  <p style={styles.blackText}>{exp.location}</p>
                </div>
              </div>
              {/* {exp.url && (
                <Link url={exp.url} icon={<LinkIcon size={14} />} className="text-sm mt-1" baseColor={baseColor} />
              )} */}
              {exp.summary && <p className="mt-2 text-justify" style={styles.blackText}>{exp.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {content.education && content.education.length > 0 && (
        <Section title="Education" baseColor={baseColor}>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={styles.blackText}>{edu.institution}</h3>
                  <p style={styles.blackText}>{edu.degree}</p>
                  <p style={styles.blackText}>{edu.field}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={styles.blackText}>{`${edu.startDate} to ${edu.endDate}`}</p>
                  <p style={styles.blackText}>{edu.score}</p>
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {content.projects && content.projects.length > 0 && (
        <Section title="Projects" baseColor={baseColor}>
          {content.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold" style={styles.blackText}>{project.name}</h3>
              <p style={styles.blackText}>{project.summary}</p>
            </div>
          ))}
        </Section>
      )}

      {content.skills && content.skills.length > 0 && content.skills[0].categories && (
        <Section title="Skills" baseColor={baseColor}>
          {content.skills[0].categories.map((category, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-bold" style={styles.blackText}>{category.name}</h3>
              <p style={styles.blackText}>{category.skills.map(skill => skill.name).join(', ')}</p>
            </div>
          ))}
        </Section>
      )}

      {content.certifications && content.certifications.length > 0 && (
        <Section title="Certifications" baseColor={baseColor}>
          {content.certifications.map((cert, index) => (
            <div key={index} className="mb-2 flex justify-between">
              <span style={styles.blackText}>{cert.name}</span>
              <span style={styles.blackText}>{cert.date}</span>
            </div>
          ))}
        </Section>
      )}

      {content.languages && content.languages.length > 0 && (
        <Section title="Languages" baseColor={baseColor}>
          {content.languages.map((lang, index) => (
            <div key={index} className="mb-2 flex justify-between">
              <span style={styles.blackText}>{lang.name}</span>
              <span style={styles.blackText}>{lang.level}</span>
            </div>
          ))}
        </Section>
      )}

      <Section title="References" baseColor={baseColor}>
        <p style={styles.blackText}>Available upon request</p>
      </Section>
    </div>
  );
};

export default Template1;