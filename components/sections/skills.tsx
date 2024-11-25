import React from 'react';
import { Input } from '@/components/ui/input';

interface SkillsProps {
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ skills, handleChange }) => (
  <div>
    <h2>Technical Skills</h2>
    <Input type="text" placeholder="Languages" value={skills.languages} onChange={(e) => handleChange(e, null, 'skills', 'languages')} />
    <Input type="text" placeholder="Frameworks" value={skills.frameworks} onChange={(e) => handleChange(e, null, 'skills', 'frameworks')} />
    <Input type="text" placeholder="Tools" value={skills.tools} onChange={(e) => handleChange(e, null, 'skills', 'tools')} />
  </div>
);

export default Skills;