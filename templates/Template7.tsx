'use client'

import React from 'react'
import { ResumeData } from "@/types/types"
import { useAppSelector } from "@/hooks/hooks"
import HTMLViewer from "@/components/HTMLViewer"

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
  | "volunteerings"
  | "publications"
  | "awards"

interface ModernResumeTemplateProps {
  content: ResumeData
  baseColor: string
  fontSize: number
  fontFamily: string
  lineHeight: number
  margin: number
}

const ModernResumeTemplate: React.FC<ModernResumeTemplateProps> = ({
  content,
  baseColor = '#8B1F41',
  fontSize = 16,
  fontFamily = 'Arial, sans-serif',
  lineHeight = 1.5,
  margin = 20
}) => {
  const sectionOrder = useAppSelector((state) => state.rightsidebar.sectionOrder)
  const isSeparator = useAppSelector((state) => state.rightsidebar.separator)

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      color: "#000",
      padding: `${margin}mm`,
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    name: {
      color: baseColor,
      fontSize: '28px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: '5px',
    },
    contact: {
      fontSize: '14px',
    },
    sectionTitle: {
      color: baseColor,
      fontSize: '18px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      borderBottom: `2px solid ${baseColor}`,
      paddingBottom: '5px',
      marginBottom: '15px',
    },
    content: {
      marginBottom: '20px',
    },
    subtitle: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    dateRange: {
      fontStyle: 'italic',
      marginBottom: '5px',
    },
    link: {
      color: baseColor,
      textDecoration: 'none',
    },
  }

  const renderSection = (sectionName: SectionName) => {
    switch (sectionName) {
      case "basics":
        const basics = content.basics?.[0]
        if (!basics) return null
        return (
          <header style={styles.header}>
            <h1 style={styles.name}>{basics.name}</h1>
            <p style={styles.contact}>
              {basics.email} {basics.phone && `| ${basics.phone}`} {basics.location && `| ${basics.location}`}
              {basics.url && (
                <span>
                  {' '}| <a href={basics.url.href} target="_blank" rel="noopener noreferrer" style={styles.link}>{basics.url.label}</a>
                </span>
              )}
            </p>
          </header>
        )

      case "summary":
        if (!content.summary?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Objective</h2>
            <HTMLViewer lineHeight={lineHeight} content={content.summary[0].content} />
          </section>
        )

      case "experience":
        if (!content.experience?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Experience</h2>
            {content.experience.map((exp, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.dateRange}>{exp.startDate} {exp.endDate && `- ${exp.endDate}`}</div>
                <div style={styles.subtitle}>{exp.role}</div>
                <div>{exp.organization}, {exp.location}</div>
                {exp.summary && <HTMLViewer lineHeight={lineHeight} content={exp.summary} />}
              </div>
            ))}
          </section>
        )

      case "education":
        if (!content.education?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Education</h2>
            {content.education.map((edu, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.dateRange}>{edu.startDate} {edu.endDate && `- ${edu.endDate}`}</div>
                <div style={styles.subtitle}>{edu.degree}{edu.field && `, ${edu.field}`}</div>
                <div>{edu.institution}</div>
                {edu.score && <div>GPA: {edu.score}</div>}
              </div>
            ))}
          </section>
        )

      case "skills":
        if (!content.skills?.[0]?.categories) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Skills</h2>
            {content.skills[0].categories.map((category, index) => (
              <div key={index} style={{marginBottom: '10px'}}>
                <div style={styles.subtitle}>{category.name}</div>
                <div>{category.skills.map(skill => skill.name).join(', ')}</div>
              </div>
            ))}
          </section>
        )

      case "projects":
        if (!content.projects?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Projects</h2>
            {content.projects.map((project, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.subtitle}>{project.name}</div>
                <div style={styles.dateRange}>{project.startDate} {project.endDate && `- ${project.endDate}`}</div>
                {project.url && (
                  <a href={project.url.href} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    {project.url.label}
                  </a>
                )}
                {project.summary && <HTMLViewer lineHeight={lineHeight} content={project.summary} />}
                {project.keywords && (
                  <div style={{marginTop: '5px'}}>
                    <strong>Technologies:</strong> {project.keywords.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )

      case "certifications":
        if (!content.certifications?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Certifications and Courses</h2>
            {content.certifications.map((cert, index) => (
              <div key={index} style={{marginBottom: '10px'}}>
                <div style={styles.subtitle}>{cert.name}</div>
                <div>{cert.issuer} - {cert.date}</div>
                {cert.url && (
                  <a href={cert.url.href} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    {cert.url.label}
                  </a>
                )}
              </div>
            ))}
          </section>
        )

      case "languages":
        if (!content.languages?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Languages</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {content.languages.map((lang, index) => (
                <div key={index} style={{marginBottom: '5px', marginRight: '15px'}}>
                  <strong>{lang.name}:</strong> {lang.level}
                </div>
              ))}
            </div>
          </section>
        )

      case "profiles":
        if (!content.profiles?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Profiles</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {content.profiles.map((profile, index) => (
                <a
                  key={index}
                  href={profile.url.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {profile.url.label}
                </a>
              ))}
            </div>
          </section>
        )

      case "references":
        if (!content.references?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>References</h2>
            {content.references.map((ref, index) => (
              <div key={index} style={{marginBottom: '10px'}}>
                <div style={styles.subtitle}>{ref.name}</div>
                <div>{ref.phone}</div>
                <div>{ref.email}</div>
              </div>
            ))}
          </section>
        )

      case "volunteerings":
        if (!content.volunteer?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Volunteer Experience</h2>
            {content.volunteer.map((vol, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.dateRange}>{vol.startDate} - {vol.endDate}</div>
                <div style={styles.subtitle}>{vol.role}</div>
                <div>{vol.organization}, {vol.location}</div>
              </div>
            ))}
          </section>
        )

      case "publications":
        if (!content.publications?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Publications</h2>
            {content.publications.map((pub, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.subtitle}>{pub.name}</div>
                <div>{pub.publisher}, {pub.date}</div>
                {pub.url && (
                  <a href={pub.url.href} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    {pub.url.label}
                  </a>
                )}
              </div>
            ))}
          </section>
        )

      case "awards":
        if (!content.awards?.length) return null
        return (
          <section style={styles.content}>
            <h2 style={styles.sectionTitle}>Awards</h2>
            {content.awards.map((award, index) => (
              <div key={index} style={{marginBottom: '15px'}}>
                <div style={styles.subtitle}>{award.title}</div>
                <div>{award.awarder}, {award.date}</div>
                {award.summary && <HTMLViewer lineHeight={lineHeight} content={award.summary} />}
              </div>
            ))}
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      {sectionOrder.column1.map((sectionName) =>
        renderSection(sectionName as SectionName)
      )}
    </div>
  )
}

export default ModernResumeTemplate