import React, { useEffect } from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ResumeData } from "@/types/types";

const content: ResumeData = {
  basics: [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      headLine: "Experienced Software Engineer",
      picture: undefined,
      url: {
        href: "https://johndoe.com",
        label: "Personal Website",
      },
    },
  ],
  summary: [
    {
      content: "Passionate software engineer with 5+ years of experience in developing scalable web applications.",
    },
  ],
  profiles: [
    {
      url: {
        href: "https://linkedin.com/in/johndoe",
        label: "LinkedIn",
      },
    },
    {
      url: {
        href: "https://github.com/johndoe",
        label: "GitHub",
      },
    },
  ],
  skills: [
    {
      id: "tech-skills",
      categories: [
        {
          id: "programming-languages",
          name: "Programming Languages",
          skills: [
            { name: "JavaScript", level: "Advanced" },
            { name: "Python", level: "Intermediate" },
            { name: "Java", level: "Beginner" },
          ],
        },
        {
          id: "frameworks",
          name: "Frameworks",
          skills: [
            { name: "React", level: "Advanced" },
            { name: "Node.js", level: "Intermediate" },
            { name: "Django", level: "Beginner" },
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      summary: "Developed a full-stack e-commerce platform using React and Node.js",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      url: {
        href: "https://github.com/johndoe/ecommerce-platform",
        label: "GitHub Repository",
      },
      keywords: ["React", "Node.js", "MongoDB", "Express"],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      specialization: "Software Engineering",
      startDate: "2015-09-01",
      endDate: "2019-05-31",
      score: "3.8 GPA",
    },
  ],
  experience: [
    {
      organization: "Tech Solutions Inc.",
      role: "Senior Software Engineer",
      startDate: "2019-06-01",
      endDate: "Present",
      location: "New York, NY",
      summary: "Lead developer for multiple web applications, mentoring junior developers, and implementing best practices.",
    },
  ],
  languages: [
    {
      name: "English",
      level: "Advanced",
    },
    {
      name: "Spanish",
      level: "Intermediate",
    },
  ],
  volunteer: [
    {
      organization: "Code for Good",
      role: "Volunteer Developer",
      startDate: "2020-01-01",
      endDate: "Present",
      location: "Remote",
    },
  ],
  awards: [
    {
      title: "Best Innovative Project",
      awarder: "Annual Tech Conference",
      date: "2021-11-15",
      summary: "Awarded for developing an AI-powered accessibility tool for websites.",
    },
  ],
  publications: [
    {
      name: "Modern Web Development Techniques",
      publisher: "Tech Journal",
      publishedIn: "Volume 5, Issue 2",
      url: {
        href: "https://techjournal.com/article123",
        label: "Article Link",
      },
      date: "2022-03-01",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2021-08-15",
      url: {
        href: "https://www.youracclaim.com/badges/aws-certified-developer",
        label: "Verify Certification",
      },
    },
  ],
  references: [
    {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@techsolutions.com",
    },
  ],
};

interface TemplateProps {
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
}> = ({ title, children, baseColor }) => {
  return (
    <section className="mt-4 pt-4" style={{ borderTop: `1px solid ${baseColor}` }}>
      <h4 className="mb-2 text-base font-bold" style={{ color: baseColor }}>{title}</h4>
      <div>{children}</div>
    </section>
  );
};

const Header: React.FC<{ basics: any; baseColor: string; fontSize: number; lineHeight: number }> = ({ basics, baseColor, fontSize, lineHeight }) => {
  const scaleFactor = fontSize / 16;
  const styles = {
    container: {
      backgroundColor: baseColor,
      borderRadius: '8px',
      padding: '1.5rem',
      color: 'white',
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
    },
    name: {
      fontSize: `${2 * scaleFactor}rem`,
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    headline: {
      fontSize: `${1.2 * scaleFactor}rem`,
      marginBottom: '1rem',
    },
    details: {
      fontSize: `${scaleFactor}rem`,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.name}>{basics.name}</h2>
      <p className="text-white" style={styles.headline}>{basics.headLine}</p>
      <hr style={{ borderColor: 'white', opacity: 0.5, margin: '1rem 0' }} />
      <div style={styles.details} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {basics.location && (
          <>
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-map-pin" />
              <div>{basics.location}</div>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {basics.phone && (
          <>
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-phone" />
              <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                {basics.phone}
              </a>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {basics.email && (
          <>
            <div className="flex items-center gap-x-1.5 mr-2">
              <i className="ph ph-bold ph-at" />
              <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                {basics.email}
              </a>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {isUrl(basics.url?.href) && (
          <>
            <Link url={basics.url} />
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
      </div>
    </div>
  );
};

const Template2: React.FC<TemplateProps> = ({
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
    dispatch(UpdateBaseColor("#ca8a04"));
  }, [dispatch]);

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black",
      padding: `${margin}mm`,
      height: "100%",
    },
    body: {
      fontSize: `${1.1 * scaleFactor}rem`,
      color: "black",
    },
  };

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'summary':
        return content.summary && content.summary.length > 0 && (
          <Section title="Summary" baseColor={baseColor}>
            <div
              dangerouslySetInnerHTML={{ __html: content.summary[0].content }}
              style={styles.body}
              className="text-justify"
            />
          </Section>
        );
      case 'experience':
        return content.experience && content.experience.length > 0 && (
          <Section title="Experience" baseColor={baseColor}>
            <div className="space-y-4">
              {content.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{exp.organization}</div>
                      <div>{exp.role}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-bold">{`${exp.startDate} - ${exp.endDate}`}</div>
                      <div>{exp.location}</div>
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
        );
      case 'skills':
        return content.skills && content.skills.length > 0 && content.skills[0].categories && (
          <Section title="Skills" baseColor={baseColor}>
            <div className="space-y-4">
              {content.skills[0].categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-bold">{category.name}</div>
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
        );
      case 'languages':
        return content.languages && content.languages.length > 0 && (
          <Section title="Languages" baseColor={baseColor}>
            <div className="space-y-2">
              {content.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-bold">{lang.name}</span>
                  <span>{lang.level}</span>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'education':
        return content.education && content.education.length > 0 && (
          <Section title="Education" baseColor={baseColor}>
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <div className="font-bold">{edu.institution}</div>
                    <div>{edu.field}</div>
                    <div>{edu.score}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-bold">{`${edu.startDate} - ${edu.endDate}`}</div>
                    <div>{edu.degree}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'certifications':
        return content.certifications && content.certifications.length > 0 && (
          <Section title="Certifications" baseColor={baseColor}>
            <div className="space-y-2">
              {content.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between">
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
          <Section title="Projects" baseColor={baseColor}>
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
                      <div className="font-bold">{`${project.startDate} - ${project.endDate}`}</div>
                    </div>
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
        );
      case 'volunteer':
        return content.volunteer && content.volunteer.length > 0 && (
          <Section title="Volunteer Experience" baseColor={baseColor}>
            <div className="space-y-4">
              {content.volunteer.map((vol, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{vol.organization}</div>
                      <div>{vol.role}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-bold">{`${vol.startDate} - ${vol.endDate}`}</div>
                      <div>{vol.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'awards':
        return content.awards && content.awards.length > 0 && (
          <Section title="Awards" baseColor={baseColor}>
            <div className="space-y-4">
              {content.awards.map((award, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{award.title}</div>
                      <div>{award.awarder}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-bold">{award.date}</div>
                    </div>
                  </div>
                  {award.summary && !isEmptyString(award.summary) && (
                    <div
                      dangerouslySetInnerHTML={{ __html: award.summary }}
                      style={styles.body}
                      className="text-justify"
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>
        );
      case 'publications':
        return content.publications && content.publications.length > 0 && (
          <Section title="Publications" baseColor={baseColor}>
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
                      <div className="font-bold">{pub.date}</div>
                    </div>
                  </div>
                  <div>{pub.publisher}</div>
                  <div>{pub.publishedIn}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'references':
        return content.references && content.references.length > 0 && (
          <Section title="References" baseColor={baseColor}>
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
        );
      case 'basics':
        return content.basics && (
          <Header basics={content.basics[0]} baseColor={baseColor} fontSize={fontSize} lineHeight={lineHeight} />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container} className="p-custom grid grid-cols-2 gap-6">
      <div className="main col-span-2 space-y-4">
        {sectionOrder.column1.map((sectionName) => renderSection(sectionName))}
      </div>
      <div className="sidebar col-span-1 space-y-4">
        {sectionOrder.column2.map((sectionName) => renderSection(sectionName))}
      </div>
    </div>
  );
};

export default Template2;