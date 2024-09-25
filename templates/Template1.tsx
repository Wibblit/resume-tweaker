import React from "react";
import { cn } from "@/lib/utils";
import { ResumeData } from "@/types/types";

const isEmptyString = (str: string): boolean => {
  return str.trim().length === 0;
};

const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

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
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight &&
        (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
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
      icon={<i className="ph ph-bold ph-globe text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

const Section: React.FC<{
  section: any;
  children: (item: any) => React.ReactNode;
}> = ({ section, children }) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className="grid grid-cols-5 border-t pt-2.5">
      <div>
        <h4 className="text-base font-bold">{section.name}</h4>
      </div>

      <div
        className="col-span-4 grid gap-x-6 gap-y-3"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items
          .filter((item: any) => item.visible)
          .map((item: any) => (
            <div key={item.id} className="space-y-2">
              <div>{children(item)}</div>
              {item.summary && !isEmptyString(item.summary) && (
                <div
                  dangerouslySetInnerHTML={{ __html: item.summary }}
                  className="wysiwyg"
                />
              )}
            </div>
          ))}
      </div>
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
  const basics = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    headline: "Experienced Software Developer",
    location: "New York, NY",
    url: { href: "https://johndoe.com", label: "Portfolio" },
    summary:
      "Passionate software developer with 5+ years of experience in creating robust web applications. Skilled in React, Node.js, and Python.",
  };

  const sections = {
    experience: {
      id: "experience",
      name: "Professional Experience",
      items: [
        {
          id: "exp1",
          visible: true,
          company: "Tech Solutions Inc.",
          position: "Senior Software Developer",
          location: "New York, NY",
          date: "2018 - Present",
          url: { href: "https://techsolutions.com", label: "Tech Solutions" },
          summary:
            "Led a team of 5 developers in creating a scalable e-commerce platform. Implemented CI/CD pipelines and reduced deployment time by 50%.",
        },
        {
          id: "exp2",
          visible: true,
          company: "WebDev Co.",
          position: "Junior Developer",
          location: "Boston, MA",
          date: "2016 - 2018",
          url: { href: "https://webdevco.com", label: "WebDev Co." },
          summary:
            "Developed and maintained multiple client websites using React and Node.js. Improved site load times by 30% through optimization techniques.",
        },
      ],
      visible: true,
      columns: 1,
    },
    education: {
      id: "education",
      name: "Education",
      items: [
        {
          id: "edu1",
          visible: true,
          institution: "University of Technology",
          studyType: "Bachelor's Degree",
          area: "Computer Science",
          score: "3.8 GPA",
          date: "2012 - 2016",
          url: {
            href: "https://uotech.edu",
            label: "University of Technology",
          },
          summary:
            "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development, Database Management.",
        },
      ],
      visible: true,
      columns: 1,
    },
    skills: {
      id: "skills",
      name: "Skills",
      items: [
        {
          id: "skill1",
          visible: true,
          name: "Web Development",
          keywords: ["React", "Node.js", "Express", "MongoDB"],
          level: 5,
        },
        {
          id: "skill2",
          visible: true,
          name: "Programming Languages",
          keywords: ["JavaScript", "Python", "Java", "C++"],
          level: 4,
        },
        {
          id: "skill3",
          visible: true,
          name: "DevOps",
          keywords: ["Docker", "Jenkins", "AWS", "Azure"],
          level: 3,
        },
      ],
      visible: true,
      columns: 2,
    },
  };

  console.log(content)

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        color: baseColor,
        padding: `${margin}mm`,
        height: "100%",
      }}
    >
      <div className="p-custom space-y-4">
        <header className="flex flex-col items-center space-y-2 text-center">
          <div>
            <div className="text-2xl font-bold">{content?.basics[0]?.name}</div>
            <div className="text-base">{content.basics[0]?.headLine}</div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
            {basics.location && (
              <div className="flex items-center gap-x-1.5">
                <i className="ph ph-bold ph-map-pin text-primary" />
                <div>{content.basics[0]?.location}</div>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-center gap-x-1.5">
                <i className="ph ph-bold ph-phone text-primary" />
                <a
                  href={`tel:${content.basics[0]?.phone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.basics[0]?.phone}
                </a>
              </div>
            )}
            {basics.email && (
              <div className="flex items-center gap-x-1.5">
                <i className="ph ph-bold ph-at text-primary" />
                <a
                  href={`mailto:${content.basics[0]?.email}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.basics[0]?.email}
                </a>
              </div>
            )}
            <Link url={content?.basics[0]?.url} />
          </div>
        </header>

        <div className="space-y-4">
          <section id="summary" className="grid grid-cols-5 border-t pt-2.5">
            <div>
              <h4 className="text-base font-bold">Summary</h4>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: basics.summary }}
              className="wysiwyg col-span-4"
            />
          </section>

          <Section section={sections.experience}>
            {(item) => (
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <LinkedEntity
                    name={item.company}
                    url={item?.url}
                    separateLinks={false}
                    className="font-bold"
                  />
                  <div>{item.position}</div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-bold">{item.date}</div>
                  <div>{item.location}</div>
                </div>
              </div>
            )}
          </Section>

          <Section section={sections.education}>
            {(item) => (
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <LinkedEntity
                    name={item.institution}
                    url={item?.url}
                    separateLinks={false}
                    className="font-bold"
                  />
                  <div>{item.area}</div>
                  <div>{item.score}</div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-bold">{item.date}</div>
                  <div>{item.studyType}</div>
                </div>
              </div>
            )}
          </Section>

          <Section section={sections.skills}>
            {(item) => (
              <div className="space-y-0.5">
                <div className="font-bold">{item.name}</div>
                {item.keywords && item.keywords.length > 0 && (
                  <p className="text-sm">{item.keywords.join(", ")}</p>
                )}
                {item.level > 0 && (
                  <div className="flex items-center gap-x-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "size-2 rounded-full border border-primary",
                          item.level > index && "bg-primary"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};
export default Template1;
