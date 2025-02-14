import { cn, isEmptyString, isUrl } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ResumeData } from "@/types/types";
import { SocialIcon } from "react-social-icons";
import HTMLViewer from "@/components/HTMLViewer";
import { Custom } from "@/types/types";
import { formatDate } from "@/utils/formatDate";

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
  const baseColor = useAppSelector(state => state?.rightsidebar?.baseColor)
  return (
    <div className={className}>
      <span style={{fontWeight : 600}} className="bold">{name}</span>
      {name && url.label && <div className="mx-1">|</div>}
      {url.label && (
        <a
          href={url.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: baseColor }}
        >
          {url.label}
        </a>
      )}
    </div>
  );
};


const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  baseColor: string;
}> = ({ title, children, baseColor }) => {
  const isSeparator: boolean = useAppSelector(
    (state) => state?.rightsidebar?.separator
  );
  return (
    <section
      className="mt-2 pt-1"
      style={isSeparator ? { borderTop: `1px solid ${baseColor}` } : {}}
    >
      <h4 className="mb-1 text-base font-bold" style={{ color: baseColor }}>
        {title}
      </h4>
      <div>{children}</div>
    </section>
  );
};

const Header: React.FC<{
  basics: any;
  baseColor: string;
  fontSize: number;
  lineHeight: number;
}> = ({ basics, baseColor, fontSize, lineHeight }) => {
  const scaleFactor = fontSize / 16;
  const styles = {
    container: {
      backgroundColor: baseColor,
      borderRadius: "8px",
      padding: "1em",
      color: "white",
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
    },
    name: {
      fontSize: `${2 * scaleFactor}rem`,
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    headline: {
      fontSize: `${1.2 * scaleFactor}rem`,
      marginBottom: "1rem",
    },
    details: {
      fontSize: `${scaleFactor}rem`,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.name}>{basics?.name}</h2>
      <p className="text-white" style={styles.headline}>
        {basics?.headLine}
      </p>
      {(basics.location || basics.phone || basics.email || basics.url.label) && <hr style={{ borderColor: "white", opacity: 0.5, margin: "1rem 0" }} />}
      <div
        style={styles.details}
        className="flex flex-wrap items-center gap-x-2 gap-y-0.5"
      >
        {basics?.location && (
          <>
            <div className="mr-2 flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-map-pin" />
              <div>{basics?.location}</div>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {basics?.phone && (
          <>
            <div className="mr-2 flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone" />
              <a href={`tel:${basics?.phone}`} target="_blank" rel="noreferrer">
                {basics?.phone}
              </a>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {basics?.email && (
          <>
            <div className="mr-2 flex items-center gap-x-1.5 ">
              <i className="ph ph-bold ph-at" />
              <a
                href={`mailto:${basics?.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {basics?.email}
              </a>
            </div>
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
        {isUrl(basics?.url?.href) && (
          <>
            <Link url={basics?.url} />
            <div className="size-1 rounded-full bg-white opacity-50 last:hidden" />
          </>
        )}
      </div>
    </div>
  );
};

const ResumeTemplate: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  pageIndex,
}) => {
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const isIcons: boolean = useAppSelector(
    (state) => state?.rightsidebar?.icons
  );

  const scaleFactor = fontSize / 16;

    const datetype = useAppSelector((state) => state?.rightsidebar?.datetype);
  const styles = {
    container: {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      padding: `${margin}mm`,
      color: "black",
      minHeight: "100vh",
      height: "100%",
      display: "flex",
    },
    body: {
      fontSize: `${1.1 * scaleFactor}rem`,
      color: "black",
    },
    col2: {
      width: "65%",
    },
    col2Content: {
      height: "100%",
    },
    col1Content: {
      width: "35%",
    },
  };

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case "summary":
        return (
          content.summary &&
          content.summary.length > 0 && (
            <Section title="Summary" baseColor={baseColor}>
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
              <div className="space-y-4">
                {content.experience.map((exp, index) => (
                  <div key={index} className="space-y-0.5">
                    {/* First Row: Organization | Dates */}
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="font-bold">{exp.organization}</div>
                      <div>
                        {exp.startDate && formatDate(exp.startDate, datetype)}
                        {exp.endDate && exp.startDate && (
                          <span className="mx-1">-</span>
                        )}
                        {exp.endDate && formatDate(exp.endDate, datetype)}
                      </div>
                    </div>

                    {/* Second Row: Role | Location */}
                    <div className="flex justify-between">
                      <div >{exp.role}</div>
                      <div >
                        {exp.location}
                      </div>
                    </div>

                    {/* Third Row: Summary (if exists) */}
                    {exp.summary && !isEmptyString(exp.summary) && (
                      <div >
                        <HTMLViewer
                          lineHeight={lineHeight}
                          content={exp.summary}
                        />
                      </div>
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
            <Section title="Skills" baseColor={baseColor}>
              <div className="space-y-4">
                {content.skills.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="font-bold">{category.name}</div>
                    <div className="flex flex-col gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="rounded-full px-3 grid grid-cols-2 items-center gap-2 w-full"
                          style={{
                            ...styles.body,
                          }}
                        >
                          <h5>
                            <span style={{color : baseColor}} className="mr-1">&#9679;</span>
                            {skill.name}
                          </h5>
                          <div
                            style={{ background: `${baseColor}30` }}
                            className="w-full h-2 rounded-md"
                          >
                            <div
                              style={{
                                background: baseColor,
                                width:
                                  skill.level == "Beginner"
                                    ? "33%"
                                    : skill.level == "Intermediate"
                                    ? "66%"
                                    : skill.level == "Advanced"
                                    ? "100%"
                                    : "0%",
                              }}
                              className="h-full rounded-md py-1"
                            ></div>
                          </div>
                        </div>
                      ))}
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
            <Section title="Languages" baseColor={baseColor}>
              <div className="space-y-2">
                {content.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-bold">{lang.name}</span>
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
            <Section title="Education" baseColor={baseColor}>
              <div className="space-y-4">
                {content.education.map((edu, index) => (
                  <div key={index} className="w-full">
                    {/* First Row */}
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="font-bold">
                        {edu.institution} {edu.degree && edu.institution && <span className="mx-1">|</span> }<span className="font-normal">{edu.degree}</span>
                      </div>
                      <div >
                        {edu.startDate && formatDate(edu.startDate, datetype)}
                        {edu.endDate && edu.startDate && (
                          <span className="mx-1">-</span>
                        )}
                        {edu.endDate && formatDate(edu.endDate, datetype)}
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="flex justify-between">
                      <div>{edu.field}{edu.field && edu.specialization && <span className="mx-1">|</span> }<span className="font-normal">{edu.specialization}</span></div>
                      <div className="  font-medium">
                        {edu.score}
                      </div>
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
            <Section title="Certifications" baseColor={baseColor}>
              <div className="space-y-2">
                {content.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex  items-start justify-between"
                  >
                    <LinkedEntity
                      name={cert.name}
                      url={cert.url}
                      separateLinks={false}
                      className="flex flex-wrap"
                    />
                    <div className="flex shrink-0">{cert.date && formatDate(cert.date, datetype)}</div>
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
            <Section title="Projects" baseColor={baseColor}>
              <div className="space-y-4">
                {content.projects.map((project, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={project.name}
                        url={project.url}
                        separateLinks={false}
                      />
                      <div className="shrink-0 text-right">
                        <div>
                          {project.startDate &&
                            formatDate(project.startDate, datetype)}{" "}
                          {project.endDate && project.startDate &&  <span className="mx-0.5">-</span>}{" "}
                          {project.endDate &&
                            formatDate(project.endDate, datetype)}
                        </div>
                      </div>
                    </div>
                    {project.summary && !isEmptyString(project.summary) && (
                      <HTMLViewer
                        lineHeight={lineHeight}
                        content={project.summary}
                      />
                    )}
                    {project.keywords && project.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.keywords.map((keyword, keywordIndex) => (
                          <span
                            key={keywordIndex}
                            className="rounded-lg px-2 py-0 text-[9px] font-medium leading-tight"
                            style={{
                              backgroundColor: `${baseColor}20`, // Subtle background
                              color: baseColor,
                              border: `1px solid ${baseColor}60`, // Slightly visible border
                            }}
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
        );
      case "volunteer":
        console.log(content.volunteer);
        return (
          content.volunteer &&
          content.volunteer.length > 0 && (
            <Section title="Volunteer Experience" baseColor={baseColor}>
              <div className="space-y-4">

                  {content.volunteer.map((vol, index) => (
                    <div key={index} className="space-y-1">
                      {/* First Row: Organization | Dates */}
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="font-bold">{vol.organization}</div>
                        <div >
                          {vol.startDate && formatDate(vol.startDate, datetype)}
                          {vol.endDate && vol.startDate && (
                            <span className="mx-0.5">-</span>
                          )}
                          {vol.endDate && formatDate(vol.endDate, datetype)}
                        </div>
                      </div>

                      {/* Second Row: Role | Location */}
                      <div className="flex justify-between">
                        <div >{vol.role}</div>
                        <div >
                          {vol.location}
                        </div>
                      </div>
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
            <Section title="Awards" baseColor={baseColor}>
              <div className="space-y-4">
                {content.awards.map((award, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="flex flex-wrap">
                        <div className="font-bold">{award.title}</div>
                        {award.title && award.awarder && <span className="mx-1">|</span>}
                        <div>{award.awarder}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div>
                          {award.date && formatDate(award.date, datetype)}
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
            <Section title="Publications" baseColor={baseColor}>
              <div className="space-y-4">
                {content.publications.map((pub, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <LinkedEntity
                        name={pub.name}
                        url={pub.url}
                        separateLinks={false}
                      />
                      <div className="shrink-0 text-right">
                        <div>{pub.date && formatDate(pub.date, datetype)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap w-full">
                      <div>{pub.publisher}</div>
                      <div>{pub.publishedIn}</div>
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
            <Section title="References" baseColor={baseColor}>
              <div className="space-y-2">
                {content.references.map((ref, index) => (
                  <div key={index} className="space-y-1">
                    {/* First Row: Name (bold) */}
                    <div className="font-bold">{ref.name}</div>

                    {/* Second Row: Phone | Email */}
                    <div className="flex flex-wrap   justify-between ">
                      <div>{ref.phone}</div>
                      <div>{ref.email}</div>
                    </div>
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
      case "profiles":
        return (
          content.profiles &&
          content.profiles.length > 0 && (
            <Section title="Profiles" baseColor={baseColor}>
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
                      className="no-underline text-sm"
                    >
                      {profile.url.label}
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          )
        );

      default:
         if (
           !content ||
           //@ts-ignore
           !Array.isArray(content[sectionName]) ||
           //@ts-ignore
           !content[sectionName]?.length
         )
           return null;
        return (
          <Section title={sectionName} baseColor={baseColor}>
            {
              //@ts-ignore
              content[sectionName] &&
                //@ts-ignore
                Array.isArray(content[sectionName]) &&
                //@ts-ignore
                content[sectionName]?.map((sec: Custom, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col space-y-1">
                      {/* First Row: Name, Location, URL (Left) | Dates (Right) */}
                      <div className="flex flex-wrap items-center justify-between">
                        {/* Left Section: Name, Location, Link */}
                        <div className="flex flex-wrap items-center">
                          {/* Name */}
                          {sec.name && (
                            <h3 className="font-bold">{sec.name}</h3>
                          )}
                          {((sec.name && sec.location) || (sec.name && sec.url.label)) && <span className="mx-1">|</span>}
                          {sec.location && (
                            <span >
                              {sec.location}
                            </span>
                          )}
                          {((sec.location && sec.url.label) || (sec.location && sec.name)) && <span className="mx-1">|</span>}
                          {/* URL Link */}
                          {sec.url?.label && (
                            <a
                              href={sec.url.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{color : baseColor}}
                            >
                              {sec.url.label}
                            </a>
                          )}
                        </div>

                        {/* Right Section: Dates */}
                        {sec.startDate && (
                          <div >
                            {formatDate(sec.startDate, datetype)}
                            {sec.endDate && sec.startDate && <span className="mx-0.5">-</span>}
                              {formatDate(sec.endDate, datetype)}
                          </div>
                        )}
                      </div>

                      {/* Second Row: Description (if exists) */}
                      {sec.description && (
                        <p >{sec.description}</p>
                      )}

                      {/* Third Row: Summary (if exists) */}
                      {sec.summary && (
                        <div className="mt-1 ">
                          <HTMLViewer
                            lineHeight={lineHeight}
                            content={sec.summary}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
            }
          </Section>
        );
    }
  };

  return (
    <div style={styles.container} className="flex gap-8">
      <style>{`
        .resume-content * {
          font-family: ${fontFamily}, sans-serif;
        }
      `}</style>
      <div style={styles.col1Content} className="resume-content">
        {sectionOrder.sections[pageIndex]?.column1.map((sectionName) =>
          renderSection(sectionName)
        )}
      </div>
      <div style={styles.col2}>
        <div style={styles.col2Content} className="resume-content">
          {sectionOrder.sections[pageIndex]?.column2.map((sectionName) =>
            renderSection(sectionName)
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
