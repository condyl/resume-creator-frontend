import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProjectsProps {
  projects: Array<{
    title: string;
    link: string;
    technologies: string;
    details: string[];
  }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, section: string, field: string) => void;
  handleDetailChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, detailIndex: number, section: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
  addDetail: (index: number, section: string) => void;
  removeDetail: (index: number, detailIndex: number, section: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => (
  <div>
    <h2>Projects</h2>
    {projects.map((project, index) => (
      <div key={index}>
        <Input type="text" placeholder="Title" value={project.title} onChange={(e) => handleChange(e, index, 'projects', 'title')} />
        <Input type="text" placeholder="Link" value={project.link} onChange={(e) => handleChange(e, index, 'projects', 'link')} />
        <Input type="text" placeholder="Technologies" value={project.technologies} onChange={(e) => handleChange(e, index, 'projects', 'technologies')} />
        {project.details.map((detail, detailIndex) => (
          <div key={detailIndex}>
            <Input type="text" placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'projects')} />
            <Button type="button" onClick={() => removeDetail(index, detailIndex, 'projects')}>Remove Detail</Button>
          </div>
        ))}
        <Button type="button" onClick={() => addDetail(index, 'projects')}>Add Detail</Button>
        <Button type="button" onClick={() => removeField(index, 'projects')}>Remove</Button>
      </div>
    ))}
    <Button type="button" onClick={() => addField('projects')}>Add Project</Button>
  </div>
);

export default Projects;