import React from 'react';

interface TemplateProps {
  content: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    experience: { title: string; company: string; duration: string; description: string }[];
    education: { degree: string; institution: string; year: string }[];
    skills: string[];
  };
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

const Template3: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin
}) => {
  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        color: baseColor,
        padding: `${margin}mm`,
        height: '100%',
      }}
    >
      <header className="text-center mb-4 bg-gray-100 p-4 rounded">
        <h1 className="text-3xl font-bold">{content.name}</h1>
        <p>{content.email} | {content.phone}</p>
      </header>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Summary</h2>
        <p>{content.summary}</p>
      </section>
      <div className="grid grid-cols-2 gap-4">
        <section>
          <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Experience</h2>
          {content.experience.map((exp, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{exp.title}</h3>
              <p>{exp.company} | {exp.duration}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        <div>
          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Education</h2>
            {content.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p>{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Skills</h2>
            <ul className="list-disc list-inside">
              {content.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template3;