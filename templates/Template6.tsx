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

const Template6: React.FC<TemplateProps> = ({
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
      }}
    >
      <header className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-300">
        <div>
          <h1 className="text-3xl font-bold mb-2">{content.name}</h1>
          <p>{content.email} | {content.phone}</p>
        </div>
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
          )}
        </div>
      </header>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
            <p>{content.summary}</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Experience</h2>
            {content.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-gray-600">{exp.company} | {exp.duration}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        </div>
        <div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <ul className="list-disc list-inside">
              {content.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            {content.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm">{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template6;