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

const Template7: React.FC<TemplateProps> = ({
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
        gridTemplateColumns: '1fr 3fr',
        gap: '2rem',
      }}
    >
      <div className="bg-gray-800 text-white p-6 rounded-lg">
        <div className="mb-6 relative w-40 h-40 mx-auto overflow-hidden rounded-full border-4 border-white shadow-lg">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
              <User className="w-20 h-20 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">{content.name}</h1>
        <p className="text-center mb-4">{content.email}</p>
        <p className="text-center mb-6">{content.phone}</p>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside">
          {content.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Professional Summary</h2>
          <p>{content.summary}</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Experience</h2>
          {content.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-sm text-gray-600">{exp.company} | {exp.duration}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Education</h2>
          {content.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm">{edu.institution} | {edu.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Template7;