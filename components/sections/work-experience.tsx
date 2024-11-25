import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WorkExperienceProps {
  workExperience: Array<{
    company: string;
    position: string;
    location: string;
    dates: string;
    details: string[];
  }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, section: string, field: string) => void;
  handleDetailChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, detailIndex: number, section: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
  addDetail: (index: number, section: string) => void;
  removeDetail: (index: number, detailIndex: number, section: string) => void;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ workExperience, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => (
  <div>
    <h2>Work Experience</h2>
    {workExperience.map((work, index) => (
      <div key={index}>
        <Input type="text" placeholder="Company" value={work.company} onChange={(e) => handleChange(e, index, 'workExperience', 'company')} />
        <Input type="text" placeholder="Position" value={work.position} onChange={(e) => handleChange(e, index, 'workExperience', 'position')} />
        <Input type="text" placeholder="Location" value={work.location} onChange={(e) => handleChange(e, index, 'workExperience', 'location')} />
        <Input type="text" placeholder="Dates" value={work.dates} onChange={(e) => handleChange(e, index, 'workExperience', 'dates')} />
        {work.details.map((detail, detailIndex) => (
          <div key={detailIndex}>
            <Input type="text" placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'workExperience')} />
            <Button type="button" onClick={() => removeDetail(index, detailIndex, 'workExperience')}>Remove Detail</Button>
          </div>
        ))}
        <Button type="button" onClick={() => addDetail(index, 'workExperience')}>Add Detail</Button>
        <Button type="button" onClick={() => removeField(index, 'workExperience')}>Remove</Button>
      </div>
    ))}
    <Button type="button" onClick={() => addField('workExperience')}>Add Work Experience</Button>
  </div>
);

export default WorkExperience;