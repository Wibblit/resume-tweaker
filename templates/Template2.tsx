import React, { useEffect } from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { ResumeData } from "@/types/types";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { SectionName } from "@/types/types";

interface TemplateProps {
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  content: ResumeData;
}

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
      level: "Adavanced",
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

const Link: React.FC<{
  url: { href: string; label: string };
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
}> = ({ url, icon, iconOnRight, label, className }) => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UpdateBaseColor("#d97706"))
  }, [])

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
      <h2 className="mb-2 text-xl font-bold" style={{ color: baseColor }}>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

const Template2: React.FC<TemplateProps> = ({
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {
  const basics = content.basics[0] || {};
  const sectionOrder = useAppSelector((state) => state.rightsidebar.sectionOrder);
  const scaleFactor = fontSize / 16;

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "black",
      padding: `${margin}mm`,
      height: "100%",
    },
    name: {
      fontSize: `${2.2 * scaleFactor}rem`,
      fontWeight: "bold",
      color: "white",
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

  const renderSection = (sectionName: SectionName) => {
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
        );
      case 'skills': 
        return content.skills && content.skills.length > 0 && content.skills[0].categories && (
          <Section title="Skills" baseColor={baseColor}>
            <div className="space-y-4">
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
        )
      case 'languages': 
      return content.languages && content.languages.length > 0 && (
        <Section title="Languages" baseColor={baseColor}>
          <div className="space-y-2">
            {content.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span style={styles.subtitle}>{lang.name}</span>
                <span style={styles.body}>{lang.level}</span>
              </div>
            ))}
          </div>
        </Section>
      )
      case 'education':
        return content.education && content.education.length > 0 && (
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
        )
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
                    className="font-semibold"
                  />
                  <p style={styles.body}>{cert.date}</p>
                </div>
              ))}
            </div>
          </Section>
        )
      case 'projects':
        return content.projects && content.projects.length > 0 && (
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
        )
      default:
        return null;
    }
  };

  return (
    // <div style={styles.container} className="p-custom grid grid-cols-3 gap-6">
    //   {/* <div className="sidebar col-span-1 space-y-4">
    //     <div className="bg-primary px-4 py-6 text-white" style={{ backgroundColor: baseColor, borderRadius: '8px', color: 'white' }}>
    //       <h1 style={styles.name}>{basics.name}</h1>
    //       <p style={{ ...styles.headline, color: 'white' }} className="mt-1">{basics.headLine}</p>
    //       <div className="mt-2 space-y-2" style={{ ...styles.body, color: 'white' }}>
    //         {basics.location && (
    //           <div className="flex items-center gap-x-1.5">
    //             <i className="ph ph-bold ph-map-pin" />
    //             <span>{basics.location}</span>
    //           </div>
    //         )}
    //         {basics.phone && (
    //           <div className="flex items-center gap-x-1.5">
    //             <i className="ph ph-bold ph-phone" />
    //             <a href={`tel:${basics.phone}`}>{basics.phone}</a>
    //           </div>
    //         )}
    //         {basics.email && (
    //           <div className="flex items-center gap-x-1.5">
    //             <i className="ph ph-bold ph-at" />
    //             <a href={`mailto:${basics.email}`}>{basics.email}</a>
    //           </div>
    //         )}
    //         <Link url={basics.url} />
    //       </div>
    //     </div>
        

    //     </div> */}
        
    // </div>
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