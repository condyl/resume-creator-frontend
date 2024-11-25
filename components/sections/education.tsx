import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EducationProps {
  education: {
    school: string;
    degree: string;
    dates: string;
    location: string;
    coursework: string;
  }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: string, field: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
}

const Education: React.FC<EducationProps> = ({ education, handleChange, removeField, addField }) => (
  <div>
    <h2>Education</h2>
    {education.map((edu, index) => (
      <div key={index}>
        <Input type="text" placeholder="School" value={edu.school} onChange={(e) => handleChange(e, index, 'education', 'school')} />
        <Input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education', 'degree')} />
        <Input type="text" placeholder="Dates" value={edu.dates} onChange={(e) => handleChange(e, index, 'education', 'dates')} />
        <Input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleChange(e, index, 'education', 'location')} />
        <textarea placeholder="Coursework" value={edu.coursework} onChange={(e) => handleChange(e, index, 'education', 'coursework')}></textarea>
        <Button type="button" onClick={() => removeField(index, 'education')}>Remove</Button>
      </div>
    ))}
    <Button type="button" onClick={() => addField('education')}>Add Education</Button>
  </div>
);

export default Education;