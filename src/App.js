import React, { useState } from 'react';
import axios from 'axios';

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
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

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
        <h2>Personal Information</h2>
        <input type="text" name="name" placeholder="Name" value={personalInfo.name} onChange={(e) => handleChange(e, null, 'personalInfo', 'name')} />
        <input type="email" name="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange(e, null, 'personalInfo', 'email')} />
        <input type="text" name="github" placeholder="GitHub" value={personalInfo.github} onChange={(e) => handleChange(e, null, 'personalInfo', 'github')} />
        <input type="text" name="linkedin" placeholder="LinkedIn" value={personalInfo.linkedin} onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')} />
        <input type="text" name="phone" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')} />
        
        <h2>Education</h2>
        {education.map((edu, index) => (
          <div key={index}>
            <input type="text" placeholder="School" value={edu.school} onChange={(e) => handleChange(e, index, 'education', 'school')} />
            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education', 'degree')} />
            <input type="text" placeholder="Dates" value={edu.dates} onChange={(e) => handleChange(e, index, 'education', 'dates')} />
            <input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleChange(e, index, 'education', 'location')} />
            <textarea placeholder="Coursework" value={edu.coursework} onChange={(e) => handleChange(e, index, 'education', 'coursework')}></textarea>
            <button type="button" onClick={() => removeField(index, 'education')}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addField('education')}>Add Education</button>
        
        <h2>Work Experience</h2>
        {workExperience.map((work, index) => (
          <div key={index}>
            <input type="text" placeholder="Company" value={work.company} onChange={(e) => handleChange(e, index, 'workExperience', 'company')} />
            <input type="text" placeholder="Position" value={work.position} onChange={(e) => handleChange(e, index, 'workExperience', 'position')} />
            <input type="text" placeholder="Location" value={work.location} onChange={(e) => handleChange(e, index, 'workExperience', 'location')} />
            <input type="text" placeholder="Dates" value={work.dates} onChange={(e) => handleChange(e, index, 'workExperience', 'dates')} />
            {work.details.map((detail, detailIndex) => (
              <div key={detailIndex}>
                <input type="text" placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'workExperience')} />
                <button type="button" onClick={() => removeDetail(index, detailIndex, 'workExperience')}>Remove Detail</button>
              </div>
            ))}
            <button type="button" onClick={() => addDetail(index, 'workExperience')}>Add Detail</button>
            <button type="button" onClick={() => removeField(index, 'workExperience')}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addField('workExperience')}>Add Work Experience</button>
        
        <h2>Projects</h2>
        {projects.map((project, index) => (
          <div key={index}>
            <input type="text" placeholder="Title" value={project.title} onChange={(e) => handleChange(e, index, 'projects', 'title')} />
            <input type="text" placeholder="Link" value={project.link} onChange={(e) => handleChange(e, index, 'projects', 'link')} />
            <input type="text" placeholder="Technologies" value={project.technologies} onChange={(e) => handleChange(e, index, 'projects', 'technologies')} />
            {project.details.map((detail, detailIndex) => (
              <div key={detailIndex}>
                <input type="text" placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'projects')} />
                <button type="button" onClick={() => removeDetail(index, detailIndex, 'projects')}>Remove Detail</button>
              </div>
            ))}
            <button type="button" onClick={() => addDetail(index, 'projects')}>Add Detail</button>
            <button type="button" onClick={() => removeField(index, 'projects')}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addField('projects')}>Add Project</button>
        
        <h2>Technical Skills</h2>
        <input type="text" placeholder="Languages" value={skills.languages} onChange={(e) => handleChange(e, null, 'skills', 'languages')} />
        <input type="text" placeholder="Frameworks" value={skills.frameworks} onChange={(e) => handleChange(e, null, 'skills', 'frameworks')} />
        <input type="text" placeholder="Tools" value={skills.tools} onChange={(e) => handleChange(e, null, 'skills', 'tools')} />
        
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
