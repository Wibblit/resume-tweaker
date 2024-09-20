import React from 'react';
import { User } from 'lucide-react';

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
  photoUrl?: string;
}

const Template5: React.FC<TemplateProps> = ({
  content,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  photoUrl
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
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem',
      }}
    >
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="mb-6 relative w-48 h-48 mx-auto overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-full h-full p-8 text-white" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">{content.name}</h1>
        <p className="mb-4">{content.email} | {content.phone}</p>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside">
          {content.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
          <p>{content.summary}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          {content.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.title}</h3>
              <p>{exp.company} | {exp.duration}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p>{edu.institution} | {edu.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Template5;