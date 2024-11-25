
import React from 'react';

const Skills = ({ skills, handleChange }) => (
  <div>
    <h2>Technical Skills</h2>
    <input type="text" placeholder="Languages" value={skills.languages} onChange={(e) => handleChange(e, null, 'skills', 'languages')} />
    <input type="text" placeholder="Frameworks" value={skills.frameworks} onChange={(e) => handleChange(e, null, 'skills', 'frameworks')} />
    <input type="text" placeholder="Tools" value={skills.tools} onChange={(e) => handleChange(e, null, 'skills', 'tools')} />
  </div>
);

export default Skills;