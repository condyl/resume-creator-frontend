
import React from 'react';

const Education = ({ education, handleChange, removeField, addField }) => (
  <div>
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
  </div>
);

export default Education;