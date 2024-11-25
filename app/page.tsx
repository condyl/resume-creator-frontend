'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import PersonalInfo from '@/components/sections/personal-info';
import Education from '@/components/sections/education';
import WorkExperience from '@/components/sections/work-experience';
import Projects from '@/components/sections/projects';
import Skills from '@/components/sections/skills';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface PersonalInfoType {
  name: string;
  email: string;
  github: string;
  website: string;
  linkedin: string;
  phone: string;
}

interface EducationType {
  school: string;
  degree: string;
  dates: string;
  location: string;
  coursework: string;
}

interface WorkExperienceType {
  company: string;
  position: string;
  location: string;
  dates: string;
  details: string[];
}

interface ProjectType {
  title: string;
  description: string;
  link: string;
  technologies: string;
  details: string[];
}

interface SkillsType {
  languages: string;
  frameworks: string;
  tools: string;
}

const Home: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    name: '',
    email: '',
    github: '',
    website: '',
    linkedin: '',
    phone: '',
  });
  const [education, setEducation] = useState<EducationType[]>([{ school: '', degree: '', dates: '', location: '', coursework: '' }]);
  const [workExperience, setWorkExperience] = useState<WorkExperienceType[]>([{ company: '', position: '', location: '', dates: '', details: [''] }]);
  const [projects, setProjects] = useState<ProjectType[]>([{ title: '', description: '', link: '', technologies: '', details: [''] }]);
  const [skills, setSkills] = useState<SkillsType>({ languages: '', frameworks: '', tools: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dividerPosition, setDividerPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => {
    const value = e.target.value;
    if (section === 'personalInfo') {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    } else if (section === 'skills') {
      setSkills((prev) => ({ ...prev, [field]: value }));
    } else {
      const updatedSection: (EducationType | WorkExperienceType | ProjectType)[] = [...(section === 'education' ? education : section === 'workExperience' ? workExperience : projects)];
      (updatedSection[index!] as any)[field] = value;
      if (section === 'education') setEducation(updatedSection as EducationType[]);
      if (section === 'workExperience') setWorkExperience(updatedSection as WorkExperienceType[]);
      if (section === 'projects') setProjects(updatedSection as ProjectType[]);
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, detailIndex: number, section: string) => {
    const value = e.target.value;
    const updatedSection: (WorkExperienceType | ProjectType)[] = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details[detailIndex] = value;
    if (section === 'workExperience') setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === 'projects') setProjects(updatedSection as ProjectType[]);
  };

  const addField = (section: string) => {
    if (section === 'education') setEducation([...education, { school: '', degree: '', dates: '', location: '', coursework: '' }]);
    if (section === 'workExperience') setWorkExperience([...workExperience, { company: '', position: '', location: '', dates: '', details: [''] }]);
    if (section === 'projects') setProjects([...projects, { title: '', description: '', link: '', technologies: '', details: [''] }]);
  };

  const addDetail = (index: number, section: string) => {
    const updatedSection: (WorkExperienceType | ProjectType)[] = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details.push('');
    if (section === 'workExperience') setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === 'projects') setProjects(updatedSection as ProjectType[]);
  };

  const removeField = (index: number, section: string) => {
    if (section === 'education') setEducation(education.filter((_, i) => i !== index));
    if (section === 'workExperience') setWorkExperience(workExperience.filter((_, i) => i !== index));
    if (section === 'projects') setProjects(projects.filter((_, i) => i !== index));
  };

  const removeDetail = (index: number, detailIndex: number, section: string) => {
    const updatedSection: (WorkExperienceType | ProjectType)[] = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details = updatedSection[index].details.filter((_, i) => i !== detailIndex);
    if (section === 'workExperience') setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === 'projects') setProjects(updatedSection as ProjectType[]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/generate-resume', {
        personalInfo,
        education,
        workExperience,
        projects,
        skills,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setResumeUrl(url);
    } catch (err) {
      setError('Failed to generate resume.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newDividerPosition = ((e.clientX - startX) / startWidth) * 100 + dividerPosition;
      setDividerPosition(Math.max(10, Math.min(90, newDividerPosition)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="container mx-auto p-4 flex" ref={containerRef}>
      <div className="pr-4" style={{ width: `${dividerPosition}%` }}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion type="single" collapsible>
            <AccordionItem value="personal-info">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>
              <PersonalInfo personalInfo={personalInfo} handleChange={handleChange} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="education">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent>
              <Education education={education} handleChange={handleChange} removeField={removeField} addField={addField} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="work-experience">
              <AccordionTrigger>Work Experience</AccordionTrigger>
              <AccordionContent>
              <WorkExperience workExperience={workExperience} handleChange={handleChange} handleDetailChange={handleDetailChange} removeField={removeField} addField={addField} addDetail={addDetail} removeDetail={removeDetail} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="projects">
              <AccordionTrigger>Projects</AccordionTrigger>
              <AccordionContent>
              <Projects projects={projects} handleChange={handleChange} handleDetailChange={handleDetailChange} removeField={removeField} addField={addField} addDetail={addDetail} removeDetail={removeDetail} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="skills">
              <AccordionTrigger>Skills</AccordionTrigger>
              <AccordionContent>
              <Skills skills={skills} handleChange={handleChange} />
              </AccordionContent>
            </AccordionItem>
            </Accordion>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Generate Resume</button>
        </form>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div
        className="w-1 bg-gray-300 cursor-col-resize"
        onMouseDown={handleMouseDown}
        style={{ width: '2px', cursor: 'col-resize' }}
      />
      <div className="pl-4" style={{ width: `${100 - dividerPosition}%` }}>
        {resumeUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Generated Resume</h2>
            <iframe src={resumeUrl} width="100%" height="600px" title="Generated Resume"></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;