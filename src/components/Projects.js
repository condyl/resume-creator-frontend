
import React from 'react';

const Projects = ({ projects, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => (
  <div>
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
  </div>
);

export default Projects;