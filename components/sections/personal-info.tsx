import React from 'react';
import { Input } from '@/components/ui/input';

interface PersonalInfoProps {
  personalInfo: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalInfo, handleChange }) => (
  <div>
    <h2>Personal Information</h2>
    <Input type="text" name="name" placeholder="Name" value={personalInfo.name} onChange={(e) => handleChange(e, null, 'personalInfo', 'name')} />
    <Input type="email" name="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange(e, null, 'personalInfo', 'email')} />
    <Input type="text" name="github" placeholder="GitHub" value={personalInfo.github} onChange={(e) => handleChange(e, null, 'personalInfo', 'github')} />
    <Input type="text" name="linkedin" placeholder="LinkedIn" value={personalInfo.linkedin} onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')} />
    <Input type="text" name="phone" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')} />
  </div>
);

export default PersonalInfo;