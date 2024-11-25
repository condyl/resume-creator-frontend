import React, { useState } from 'react';
import axios from 'axios';
import PersonalInfo from './components/PersonalInfo';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Skills from './components/Skills';

const ResumeBuilder = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    github: '',
    website: '',
    linkedin: '',
    phone: '',
  });
  const [education, setEducation] = useState([{ school: '', degree: '', dates: '', location: '', coursework: '' }]);
  const [workExperience, setWorkExperience] = useState([{ company: '', position: '', location: '', dates: '', details: [''] }]);
  const [projects, setProjects] = useState([{ title: '', description: '', link: '', technologies: '', details: [''] }]);
  const [skills, setSkills] = useState({ languages: '', frameworks: '', tools: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e, index, section, field) => {
    const value = e.target.value;
    if (section === 'personalInfo') {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    } else if (section === 'skills') {
      setSkills((prev) => ({ ...prev, [field]: value }));
    } else {
      const updatedSection = [...(section === 'education' ? education : section === 'workExperience' ? workExperience : projects)];
      updatedSection[index][field] = value;
      if (section === 'education') setEducation(updatedSection);
      if (section === 'workExperience') setWorkExperience(updatedSection);
      if (section === 'projects') setProjects(updatedSection);
    }
  };

  const handleDetailChange = (e, index, detailIndex, section) => {
    const value = e.target.value;
    const updatedSection = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details[detailIndex] = value;
    if (section === 'workExperience') setWorkExperience(updatedSection);
    if (section === 'projects') setProjects(updatedSection);
  };

  const addField = (section) => {
    if (section === 'education') setEducation([...education, { school: '', degree: '', dates: '', location: '', coursework: '' }]);
    if (section === 'workExperience') setWorkExperience([...workExperience, { company: '', position: '', location: '', dates: '', details: [''] }]);
    if (section === 'projects') setProjects([...projects, { title: '', description: '', link: '', technologies: '', details: [''] }]);
  };

  const addDetail = (index, section) => {
    const updatedSection = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details.push('');
    if (section === 'workExperience') setWorkExperience(updatedSection);
    if (section === 'projects') setProjects(updatedSection);
  };

  const removeField = (index, section) => {
    if (section === 'education') setEducation(education.filter((_, i) => i !== index));
    if (section === 'workExperience') setWorkExperience(workExperience.filter((_, i) => i !== index));
    if (section === 'projects') setProjects(projects.filter((_, i) => i !== index));
  };

  const removeDetail = (index, detailIndex, section) => {
    const updatedSection = [...(section === 'workExperience' ? workExperience : projects)];
    updatedSection[index].details = updatedSection[index].details.filter((_, i) => i !== detailIndex);
    if (section === 'workExperience') setWorkExperience(updatedSection);
    if (section === 'projects') setProjects(updatedSection);
  };

  const handleSubmit = async (e) => {
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

  return (
    <div>
      <h1>Resume Builder</h1>
      <form onSubmit={handleSubmit}>
        <PersonalInfo personalInfo={personalInfo} handleChange={handleChange} />
        <Education education={education} handleChange={handleChange} removeField={removeField} addField={addField} />
        <WorkExperience workExperience={workExperience} handleChange={handleChange} handleDetailChange={handleDetailChange} removeField={removeField} addField={addField} addDetail={addDetail} removeDetail={removeDetail} />
        <Projects projects={projects} handleChange={handleChange} handleDetailChange={handleDetailChange} removeField={removeField} addField={addField} addDetail={addDetail} removeDetail={removeDetail} />
        <Skills skills={skills} handleChange={handleChange} />
        <button type="submit">Generate Resume</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {resumeUrl && (
        <div>
          <h2>Generated Resume</h2>
          <iframe src={resumeUrl} width="100%" height="600px" title="Generated Resume"></iframe>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
