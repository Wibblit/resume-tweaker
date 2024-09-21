import React from 'react';
import { MapPin, Phone, Mail, Globe, Linkedin, Github, FileStack } from 'lucide-react';

interface TemplateProps {
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

const Template1: React.FC<TemplateProps> = ({
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
        color: '#333',
        height: '100%',
        padding: `${margin}mm`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header style={{ marginBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '5px', color: baseColor }}>John Doe</h1>
        <h2 style={{ fontSize: '18px', fontWeight: 'normal', marginBottom: '5px' }}>Creative and Innovative Web Developer</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}><MapPin size={12} /> Pleasantville, CA 94588</span>
          <span style={{ display: 'flex', alignItems: 'center' }}><Phone size={12} /> (555) 123-4567</span>
          <span style={{ display: 'flex', alignItems: 'center' }}><Mail size={12} /> john.doe@gmail.com</span>
          <span style={{ display: 'flex', alignItems: 'center' }}><Globe size={12} /> https://johndoe.me/</span>
        </div>
      </header>

      <section style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: `2px solid ${baseColor}`, paddingBottom: '3px', marginBottom: '5px' }}>Profiles</h2>
        <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}><Linkedin size={12} /> johndoe</span>
          <span style={{ display: 'flex', alignItems: 'center' }}><Github size={12} /> johndoe</span>
          <span style={{ display: 'flex', alignItems: 'center' }}><FileStack size={12} /> johndoe</span>
        </div>
      </section>

      <section style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: `2px solid ${baseColor}`, paddingBottom: '3px', marginBottom: '5px' }}>Summary</h2>
        <p style={{ fontSize: '12px' }}>Innovative Web Developer with 5 years of experience in building impactful and user-friendly websites and applications. Specializes in front-end technologies and passionate about modern web standards and cutting-edge development techniques.</p>
      </section>

      <section style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: `2px solid ${baseColor}`, paddingBottom: '3px', marginBottom: '5px' }}>Experience</h2>
        <div style={{ marginBottom: '5px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '2px' }}>Senior Web Developer</h3>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '2px' }}>Creative Solutions Inc. | January 2019 to Present</p>
          <ul style={{ paddingLeft: '20px', fontSize: '12px', margin: '0' }}>
            <li>Spearheaded the redesign of the main product website, resulting in a 40% increase in user engagement.</li>
            <li>Developed and implemented a new responsive framework, improving cross-device compatibility.</li>
          </ul>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '2px' }}>Web Developer</h3>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '2px' }}>TechAdvancers | June 2016 to December 2018</p>
          <ul style={{ paddingLeft: '20px', fontSize: '12px', margin: '0' }}>
            <li>Collaborated in a team of 10 to develop high-quality web applications using React.js and Node.js.</li>
            <li>Optimized application performance, achieving a 30% reduction in load times.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: `2px solid ${baseColor}`, paddingBottom: '3px', marginBottom: '5px' }}>Education</h2>
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '2px' }}>Bachelor's in Computer Science</h3>
          <p style={{ fontSize: '12px' }}>University of California, Berkeley | August 2012 to May 2016</p>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '16px', borderBottom: `2px solid ${baseColor}`, paddingBottom: '3px', marginBottom: '5px' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', fontSize: '12px' }}>
          <span style={{ backgroundColor: baseColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>HTML5</span>
          <span style={{ backgroundColor: baseColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>JavaScript</span>
          <span style={{ backgroundColor: baseColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>React.js</span>
          <span style={{ backgroundColor: baseColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>Node.js</span>
          <span style={{ backgroundColor: baseColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>Python</span>
        </div>
      </section>
    </div>
  );
};

export default Template1;