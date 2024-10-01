"use client";

import React from "react";
import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppSelector } from "@/hooks/hooks";
import { ResumeData } from "@/types/types";
import HTMLViewer from "@/components/HTMLViewer";

interface TemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

export type SectionName =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "profiles"
  | "basics"
  | "references"
  | "volunteerings"
  | "publications"
  | "awards";

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  baseColor: string;
}> = ({ title, children, baseColor }) => {
  return (
    <section className="mb-4">
      <h2
        className="mb-2 text-lg font-bold uppercase border-b-2 pb-1"
        style={{ color: baseColor, borderColor: baseColor }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

const ResumeTemplate: React.FC<TemplateProps> = ({
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

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#333",
      padding: `${margin}mm`,
      height: "100%",
    },
  };

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "summary":
        return (
          content.summary &&
          content.summary.length > 0 && (
            <Section title="Summary" baseColor={baseColor}>
              {/* <p className="text-sm text-justify leading-snug whitespace-pre-wrap">
                {content.summary[0].content}
              </p> */}
              <HTMLViewer
                lineHeight={lineHeight}
                content={content.summary[0].content}
              />
            </Section>
          )
        );
      case "experience":
        return (
          content.experience &&
          content.experience.length > 0 && (
            <Section title="Experience" baseColor={baseColor}>
              {content.experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-base font-semibold mr-2">
                      {exp.organization}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <em className="text-sm mr-2">{exp.role}</em>
                    <span className="text-xs text-gray-600">
                      {exp.location}
                    </span>
                  </div>
                  {exp.summary && (
                    // <p className="text-sm text-justify mt-1 leading-snug whitespace-pre-wrap">
                    //   {exp.summary}
                    // </p>
                    <HTMLViewer lineHeight={lineHeight} content={exp.summary} />
                  )}
                </div>
              ))}
            </Section>
          )
        );
      case "education":
        return (
          content.education &&
          content.education.length > 0 && (
            <Section title="Education" baseColor={baseColor}>
              {content.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-base font-semibold mr-2">
                      {edu.institution}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {edu.startDate} {edu.endDate && " - "} {edu.endDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <span className="text-sm mr-2">
                      {edu.degree} {edu.field && "in"} {edu.field}
                      {edu.specialization &&
                        ` with specialization in ${edu.specialization}`}
                    </span>
                    {edu.score && <p className="text-xs mt-1">{edu.score}</p>}
                  </div>
                </div>
              ))}
            </Section>
          )
        );
      case "skills":
        return (
          content.skills &&
          content.skills.length > 0 &&
          content.skills[0].categories && (
            <Section title="Skills" baseColor={baseColor}>
              {content.skills[0].categories.map((category, index) => (
                <div key={index} className="mb-2">
                  <h3 className="text-sm font-semibold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs leading-snug break-words whitespace-pre-wrap">
                    {category.skills.map((skill) => skill.name).join(", ")}
                  </p>
                </div>
              ))}
            </Section>
          )
        );
      case "projects":
        return (
          content.projects &&
          content.projects.length > 0 && (
            <Section title="Projects" baseColor={baseColor}>
              {content.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-center mb-1">
                    <h3 className="text-base flex items-center font-semibold text-gray-800 mr-2">
                      {project.name}
                      {project.url.href && (
                        <>
                          {" "}
                          <p className="mr-1 ml-1"> - </p>
                          <a
                            href={project.url.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 flex items-center break-words"
                          >
                            <p
                              style={{ color: `${baseColor}` }}
                              className="underline font-medium"
                            >
                              {project.url.label}
                            </p>
                          </a>
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {project.startDate} - {project.endDate}
                    </p>
                  </div>
                  {project.summary && (
                    // <p className="text-sm text-gray-700 leading-snug mb-1 text-justify whitespace-pre-wrap">
                    //   {project.summary}
                    // </p>
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={project.summary}
                    />
                  )}
                </div>
              ))}
            </Section>
          )
        );
      case "certifications":
        return (
          content.certifications &&
          content.certifications.length > 0 && (
            <Section title="Certifications" baseColor={baseColor}>
              {content.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between items-baseline mb-2"
                >
                  <span className="text-sm font-semibold mr-2">
                    {cert.name}
                  </span>
                  <span className="text-xs text-gray-600">{cert.date}</span>
                  {cert.url && (
                    <a
                      href={cert.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </Section>
          )
        );
      case "languages":
        return (
          content.languages &&
          content.languages.length > 0 && (
            <Section title="Languages" baseColor={baseColor}>
              <div className="flex flex-col items-start justify-start">
                {content.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-baseline w-full"
                  >
                    <span className="text-sm font-semibold mr-2">
                      {lang.name}
                    </span>
                    <span className="text-xs text-gray-600">{lang.level}</span>
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
            <Section title="References" baseColor={baseColor}>
              {content.references.map((ref, index) => (
                <div key={index} className="mb-2">
                  <h3 className="text-sm font-semibold">{ref.name}</h3>
                  <p className="text-xs break-words">
                    <a href={`tel:${ref.phone}`}>{ref.phone}</a>
                  </p>
                  <p className="text-xs break-words">
                    <a href={`mailto:${ref.email}`}>{ref.email}</a>
                  </p>
                </div>
              ))}
            </Section>
          )
        );
      case "volunteerings":
        return (
          content.volunteer &&
          content.volunteer.length > 0 && (
            <Section title="Volunteer" baseColor={baseColor}>
              {content.volunteer.map((vol, index) => (
                <div key={index} className="mb-3">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-base font-semibold mr-2">
                      {vol.organization}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {vol.startDate} - {vol.endDate}
                    </span>
                  </div>
                  <p className="text-sm italic mb-1">{vol.role}</p>
                  <p className="text-xs text-gray-600">{vol.location}</p>
                </div>
              ))}
            </Section>
          )
        );
      case "publications":
        return (
          content.publications &&
          content.publications.length > 0 && (
            <Section title="Publications" baseColor={baseColor}>
              {content.publications.map((pub, index) => (
                <div key={index} className="mb-2">
                  <h3 className="text-sm font-semibold break-words">
                    {pub.name}
                  </h3>
                  <p className="text-xs break-words">
                    {pub.publisher}, {pub.publishedIn}
                  </p>
                  <p className="text-xs text-gray-600">{pub.date}</p>
                  {pub.url && (
                    <a
                      href={pub.url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 underline"
                    >
                      {pub.url.label}
                    </a>
                  )}
                </div>
              ))}
            </Section>
          )
        );
      case "awards":
        return (
          content.awards &&
          content.awards.length > 0 && (
            <Section title="Awards" baseColor={baseColor}>
              {content.awards.map((award, index) => (
                <div key={index} className="mb-2">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="text-sm font-semibold mr-2">
                      {award.title}
                    </h3>
                    <span className="text-xs text-gray-600">{award.date}</span>
                  </div>
                  <h3 className="text-xs">{award.awarder}</h3>
                  {award.summary && (
                    // <p className="text-xs mt-1 text-justify leading-snug whitespace-pre-wrap">
                    //   {award.summary}
                    // </p>
                    <HTMLViewer
                      lineHeight={lineHeight}
                      content={award.summary}
                    />
                  )}
                </div>
              ))}
            </Section>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container} className="flex flex-col">
      <div className="mb-4 flex items-start">
        <div className="w-3/4 ">
          <div className="md:mb-0">
            <h1 style={{ color: baseColor }} className="text-3xl font-bold">
              {content.basics[0].name}
            </h1>
            <p className="text-base mb-1 text-gray-700 whitespace-pre-wrap">
              {content.basics[0].headLine}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.profiles.map((profile, index) => (
              <a
                key={index}
                href={profile.url.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs underline break-words"
              >
                {profile.url.label}
              </a>
            ))}
          </div>
        </div>

        <div className=" flex flex-col items-start justify-start">
          <p className="text-xs break-words">{content.basics[0].location}</p>
          <p className="text-xs break-words">
            <a href={`tel:${content.basics[0].phone}`}>
              {content.basics[0].phone}
            </a>
          </p>
          <p className="text-xs break-words">
            <a href={`mailto:${content.basics[0].email}`}>
              {content.basics[0].email}
            </a>
          </p>
          {content.basics[0].url && (
            <a
              href={content.basics[0].url.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <p className="text-xs underline break-words">
                {content.basics[0].url.label}
              </p>
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-row">
        <div className={`w-3/5 ${sectionOrder.column1.length !== 0 && "pr-8"}`}>
          {sectionOrder.column1.map((sectionName) =>
            renderSection(sectionName as SectionName)
          )}
        </div>
        <div className="min-w-2/5">
          {sectionOrder.column2.map((sectionName) =>
            renderSection(sectionName as SectionName)
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;

