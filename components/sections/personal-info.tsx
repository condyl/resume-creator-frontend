import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Import Button component
import { Eye, EyeOff } from 'lucide-react'; // Import icons

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

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalInfo, handleChange }) => {
  const [showIcons, setShowIcons] = useState({
    email: true,
    github: true,
    linkedin: true,
    phone: true,
  });

  const toggleIcon = (field: string) => {
    setShowIcons((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div>
      <div className="pb-2 flex items-center">
        <Input type="text" name="name" placeholder="Name" value={personalInfo.name} onChange={(e) => handleChange(e, null, 'personalInfo', 'name')} required />
      </div>
      <div className="pb-2 flex items-center">
        <Input type="email" name="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange(e, null, 'personalInfo', 'email')} />
        <Button onClick={() => toggleIcon('email')} className="ml-2">
          {showIcons.email ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      <div className="pb-2 flex items-center">
        <Input type="text" name="github" placeholder="GitHub" value={personalInfo.github} onChange={(e) => handleChange(e, null, 'personalInfo', 'github')} />
        <Button onClick={() => toggleIcon('github')} className="ml-2">
          {showIcons.github ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      <div className="pb-2 flex items-center">
        <Input type="text" name="linkedin" placeholder="LinkedIn" value={personalInfo.linkedin} onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')} />
        <Button onClick={() => toggleIcon('linkedin')} className="ml-2">
          {showIcons.linkedin ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      <div className="pb-2 flex items-center">
        <Input type="text" name="phone" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')} />
        <Button onClick={() => toggleIcon('phone')} className="ml-2">
          {showIcons.phone ? <Eye /> : <EyeOff />}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfo;