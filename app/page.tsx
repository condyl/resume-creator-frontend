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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BASE_URL } from '@/config';
import PDFViewer from '@/components/pdf-viewer';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

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
  location: string;
  coursework: string;
}

interface WorkExperienceType {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
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
  const [showIcons, setShowIcons] = useState({
    email: true,
    github: true,
    linkedin: true,
    phone: true,
  });
  const [education, setEducation] = useState<EducationType[]>([{ school: '', degree: '', location: '', coursework: '' }]);
  const [workExperience, setWorkExperience] = useState<WorkExperienceType[]>([{ company: '', position: '', location: '', startDate: '', endDate: '', details: [''] }]);
  const [projects, setProjects] = useState<ProjectType[]>([{ title: '', description: '', link: '', technologies: '', details: [''] }]);
  const [skills, setSkills] = useState<SkillsType>({ languages: '', frameworks: '', tools: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);

  const toggleSlideout = () => {
    setIsSlideoutOpen((prev) => !prev);
  };

  const toggleIcon = (field: keyof typeof showIcons) => {
    setShowIcons((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | null, section: string, field: string) => {
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

  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => {
    const value = e.target.value;
    const updatedSection: (WorkExperienceType | ProjectType)[] = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details[detailIndex] = value;
    if (section === 'workExperience') setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === 'projects') setProjects(updatedSection as ProjectType[]);
  };

  const addField = (section: string) => {
    if (section === 'education') setEducation([...education, { school: '', degree: '', location: '', coursework: '' }]);
    if (section === 'workExperience') setWorkExperience([...workExperience, { company: '', position: '', location: '', startDate: '', endDate: '', details: [''] }]);
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      console.log(showIcons);
      const response = await axios.post(`${BASE_URL}/api/generate-resume`, {
        personalInfo,
        education,
        workExperience,
        projects,
        skills,
        showIcons
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

  const handleOutsideClick = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsSlideoutOpen(false);
    }
  };

  React.useEffect(() => {
    if (isSlideoutOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSlideoutOpen]);

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row" ref={containerRef}>
      <div className="pr-4 w-full md:w-1/2">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 w-full md:w-auto">
            <Accordion type="single" collapsible>
            <AccordionItem value="personal-info">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>
              <PersonalInfo personalInfo={personalInfo} showIcons={showIcons} toggleIcon={toggleIcon} handleChange={handleChange} />
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
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
            {loading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
            Generate Resume
            </Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {resumeUrl && (
        <button
          onClick={toggleSlideout}
          className="fixed right-4 bottom-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded md:hidden"
        >
          View Resume
        </button>
      )}
      <div
        className="bg-gray-300 fixed top-14 left-1/2 hidden md:block"
        style={{ width: '2px', zIndex: 10, height: 'calc(100vh - 3.5rem)' }}
      />
      <div className="pl-4 w-full md:w-1/2 ml-0.5 hidden md:block">
        <div className="fixed top-10 right-0 h-full overflow-y-auto" style={{ width: 'calc(50% - 2px)', maxWidth: '100vw' }}>
          {resumeUrl && (
            <div className="mt-4 w-full">
              <PDFViewer url={resumeUrl} />
            </div>
          )}
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSlideoutOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        style={{ width: '100vw' }}
        ref={containerRef}
      >
        <button
          onClick={toggleSlideout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
        {resumeUrl && (
          <div className="mt-16 w-full">
            <PDFViewer url={resumeUrl} />
          </div>
        )}
        <button
          onClick={() => setIsSlideoutOpen(false)}
          className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Hide Resume
        </button>
      </div>
    </div>
  );
};

export default Home;
