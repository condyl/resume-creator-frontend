
import React from 'react';

const WorkExperience = ({ workExperience, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => (
  <div>
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
  </div>
);

export default WorkExperience;