"use client";

import React from "react";
import { ResumeData } from "@/types/types";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { UpdateBaseColor } from "@/slices/rightsidebarSlice";
import HTMLViewer from "@/components/HTMLViewer";
import { SocialIcon } from "react-social-icons";
import { formatDate } from "@/utils/formatDate";

type SectionName =
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
  | "volunteer"
  | "publications"
  | "awards";

interface StanfordResumeTemplateProps {
  content: ResumeData;
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  pageIndex: number;
}

export default function Component({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}: StanfordResumeTemplateProps) {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(UpdateBaseColor(baseColor));
  }, [dispatch, baseColor]);

  const isIcons = useAppSelector((state) => state?.rightsidebar?.icons);
  const isSeperator = useAppSelector((state) => state?.rightsidebar?.separator);
  const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);
  const color = useAppSelector((state) => state?.rightsidebar?.baseColor);

  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      maxWidth: "800px",
      margin: "0 auto",
      color: "#000",
    } as React.CSSProperties,
    header: {
      marginBottom: "1em",
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: "1.1em",
      fontWeight: "bold",
      textTransform: "uppercase" as const,
      borderTop: isSeperator && `2px solid ${baseColor}`,
      marginTop: "1rem",
      paddingTop: "0.5rem",
      marginBottom: "0.5rem",
      color: color,
    } as React.CSSProperties,
    dateRange: {
      fontWeight: "normal",
    } as React.CSSProperties,
    linklabel: {
      color : baseColor
    },
    text: {
      fontSize : `${fontSize}px`
    },
    name: {
      fontSize: `3em`,
      fontWeight: "bold",
      marginBottom: "0.3em",
      lineHeight: 1.2,
    },
    headline: {
      fontSize: `1.4em`,
      marginBottom: "0.2em",
      lineHeight: 1.4,
    },
    details: {
      fontSize: `1.4em`,
      lineHeight: 1.6,
    },
  };

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "basics":
        const basics = content.basics?.[0];
        if (!basics) return null;
        return (
          <div style={styles.header}>
            <h1 className="font-bold uppercase mb-1" style={styles.name}>{basics.name}</h1>
            <div className=" space-x-1" style={styles.details}>
              {basics.location && <span>{basics.location}</span>}
              {basics.phone && (
                <>
                  <span>•</span>
                  <span>{basics.phone}</span>
                </>
              )}
              {basics.email && (
                <>
                  <span>•</span>
                  <span>{basics.email}</span>
                </>
              )}
              {basics.url.label && (
                <>
                  <span>•</span>
                  <a
                    href={basics.url.href}
                    className="text-black hover:underline"
                  >
                    {basics.url.label}
                  </a>
                </>
              )}
            </div>
            {basics.headLine && <p style={styles.headline}>{basics.headLine}</p>}
          </div>
        );

      case "summary":
        if (!content.summary?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Summary</h2>
            <HTMLViewer
              lineHeight={lineHeight}
              content={content.summary[0].content}
            />
          </section>
        );

      case "education":
        if (!content.education?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Education
            </h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div
                  className="flex-shrink-0 w-auto mr-4"
                  style={styles.dateRange}
                >
                  {edu.startDate && formatDate(edu.startDate, datetype)}
                  {edu.startDate && edu.endDate && " - "}
                  {edu.endDate && formatDate(edu.endDate, datetype)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold">{edu.institution}</span>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center justify-start">
                    {edu.degree && <div>{edu.degree}</div>}
                    {((edu.degree && edu.field) || (edu.degree && edu.score)) && <span className="mx-1">|</span>}
                    {edu.field && <div>{edu.field}</div>}
                    {((edu.score && edu.field) || (edu.score && edu.degree)) && <span className="mx-1">|</span>}
                    {edu.score && <div>{edu.score}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!content.experience?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Experience
            </h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div
                  className="flex-shrink-0 w-auto mr-4"
                  style={styles.dateRange}
                >
                  {exp.startDate && formatDate(exp.startDate, datetype)}
                  {exp.startDate && exp.endDate && " - "}
                  {exp.endDate && formatDate(exp.endDate, datetype)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <span className="font-bold">{exp.role}</span>
                      {exp.role && exp.organization && (
                        <span className="mx-1">|</span>
                      )}
                      {exp.organization && <span>{exp.organization}</span>}
                      {exp.organization && exp.location && (
                        <span className="mx-1">|</span>
                      )}
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                  </div>

                  {exp.summary && (
                    <div className="mt-1">
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={exp.summary}
                        className="text-inherit"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "skills":
        if (!content.skills?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Skills</h2>
            {content.skills.map((category, index) => (
              <div key={index} className="mb-2">
                {category.name && <span className="font-bold">{category.name}: </span>}
                <span>
                  {category.skills.map((skill) => skill.name).join(", ")}
                </span>
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!content.projects?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} className="mb-3 flex w-full">
                <div className="w-auto flex-shrink-0 mr-4">
                  <span style={styles.dateRange}>
                    {project.startDate &&
                      formatDate(project.startDate, datetype)}
                    {project.startDate && project.endDate && " - "}
                    {project.endDate &&
                      formatDate(project.endDate, datetype)}
                  </span>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-start">
                    <span className="font-bold">{project.name}</span>
                    {project.name && project.url && <span className="mx-1">|</span>}
                    {project.url.href && project.url.label && (
                      <a href={project.url.href}>
                        <span style={styles.linklabel}>{project.url.label}</span>
                      </a>
                    )}
                  </div>
                  {project.summary && (
                    <div className="mt-1">
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={project.summary}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      case "certifications":
        if (!content.certifications?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Certifications
            </h2>
            <div className="space-y-2">
              {content.certifications.map((cert, index) => (
                <div key={index} className="flex flex-col">
                  {/* First Row: Name & Issuer on Left | Date on Right */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold" style={styles.text}>
                        {cert.name}
                      </span>
                      {cert.name && cert.issuer && <span className="mx-1">|</span>}
                      {cert.issuer && <span>{cert.issuer}</span>}
                      {cert.issuer && cert.url && <span className="mx-1">|</span>}
                      {cert.url && (
                        <a
                          href={cert.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.linklabel}
                        >
                          {cert.url.label}
                        </a>
                      )}
                    </div>
                    {cert.date && (
                      <span className="text-sm">
                        {formatDate(cert.date, datetype)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (!content.languages?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Languages
            </h2>
            <div>
              {content.languages.map((lang, index) => (
                <span key={index} className="mr-4">
                  {lang.name} ({lang.level})
                </span>
              ))}
            </div>
          </section>
        );

      case "profiles":
        if (!content.profiles?.length) return null;
        return (
          <section className="mb-4 flex-col">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Profiles</h2>
            <div className="flex gap-2">
              {content.profiles.map((profile, index) => (
                <div key={index} className="mb-1">
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
                    className=" hover:underline ml-1"
                    style={styles.linklabel}
                  >
                    {profile.url.label}
                  </a>
                </div>
              ))}
            </div>
          </section>
        );

      case "references":
        if (!content.references?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              References
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {content.references.map((ref, index) => (
                <div key={index} className="flex flex-col">
                  <span className="font-bold" style={styles.text}>
                    {ref.name}
                  </span>
                  <span style={styles.text}>{ref.phone}</span>
                  <span style={styles.text}>{ref.email}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "volunteer":
        if (!content.volunteer?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Volunteer Experience
            </h2>
            {content.volunteer.map((vol, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold">{vol.role}</span>
                    {vol.organization && <span>, {vol.organization}</span>}
                  </div>
                  <div style={styles.dateRange}>
                    {vol.startDate && formatDate(vol.startDate, datetype)}
                    {vol.startDate && vol.endDate && " - "}
                    {vol.endDate && formatDate(vol.endDate, datetype)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "publications":
        if (!content.publications?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              Publications
            </h2>
            <div className="space-y-2">
              {content.publications.map((pub, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between items-center"
                >
                  {/* Left Side: Name & Publisher */}
                  <div className="flex items-center gap-x-2">
                    <span className="font-bold" style={styles.text}>{pub.name}</span>
                    {pub.name && pub.publisher && (
                      <span className="mx-1">|</span>
                    )}
                    {pub.publisher && <span>{pub.publisher}</span>}
                    {pub.publisher && pub.url && (
                      <span className="mx-1">|</span>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={styles.linklabel}
                      >
                        {pub.url.label}
                      </a>
                    )}
                  </div>

                  {/* Right Side: Link */}
                  {pub.date && <span>{formatDate(pub.date, datetype)}</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case "awards":
        if (!content.awards?.length) return null;
        return (
          <section className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} className="mb-2 flex w-full">
                {/* Fixed width date container */}
                <div className="width-auto flex-shrink-0 mr-4">
                  {award.date && (
                    <span>{formatDate(award.date, datetype)}</span>
                  )}
                </div>

                {/* Flexible content container */}
                <div className="flex-grow">
                  <div className="font-bold" style={styles.text}>
                    {award.title}{" "}
                    {award.title && award.awarder && (
                      <span className="font-normal">|</span>
                    )}{" "}
                    {award.awarder}
                  </div>
                  {award.summary && (
                    <div className="mt-1">
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={award.summary}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        );

      default:
        if (
          !content ||
          !Array.isArray(content[sectionName]) ||
          //@ts-ignore
          !content[sectionName]?.length
        )
          return null;

        return (
          <div className="mb-4">
            <h2 style={styles.sectionTitle as React.CSSProperties}>
              {sectionName}
            </h2>
            {content[sectionName] &&
              Array.isArray(content[sectionName]) &&
              //@ts-ignore
              content[sectionName]?.map((sec: Custom, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col space-y-1">
                    {/* First Row: Name, Location, URL on the Left | Dates on the Right */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-x-2">
                        {sec.name && <h3>{sec.name}</h3>}
                        {((sec.name && sec.location) || (sec.name && sec.url)) && <span className="mx-1">|</span>}
                        {sec.location && <p>{sec.location}</p>}
                        {((sec.url && sec.location) || (sec.url && sec.name)) && <span className="mx-1">|</span>}
                        {sec.url && (
                          <a
                            href={sec.url.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                            style={styles.linklabel}
                          >
                            {sec.url.label}
                          </a>
                        )}
                      </div>

                      {sec.startDate && (
                        <h3>
                          {formatDate(sec.startDate, datetype)}
                          {sec.startDate && sec.endDate && " - "}
                          {sec.endDate &&
                            formatDate(sec.endDate, datetype)}
                        </h3>
                      )}
                    </div>

                    {/* Second Row: Description */}
                    {sec.description && <p>{sec.description}</p>}

                    {/* Third Row: Summary */}
                    {sec.summary && (
                      <div>
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={sec.summary}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {sectionOrder?.sections[pageIndex]?.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  );
}
