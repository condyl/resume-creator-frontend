import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; 
import { Eye, EyeOff } from 'lucide-react';

type IconFields = 'email' | 'github' | 'linkedin' | 'phone';

interface PersonalInfoProps {
  personalInfo: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
    phone: string;
  };
  showIcons: Record<IconFields, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalInfo, showIcons, toggleIcon, handleChange }) => {

  return (
    <div>
      <div className="pb-2 flex items-center">
        <div className="w-full p-1">
          <Input type="text" name="name" placeholder="Name" value={personalInfo.name} onChange={(e) => handleChange(e, null, 'personalInfo', 'name')} required />
        </div>
      </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1">
            <Input type="email" name="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange(e, null, 'personalInfo', 'email')} />
          </div>
          <Button onClick={() => toggleIcon('email')} className="ml-2">
            {showIcons.email ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none bg-gray-100 dark:bg-gray-700 rounded-md px-1">github.com/</span>
            <Input type="text" name="github" placeholder="username" value={personalInfo.github} onChange={(e) => handleChange(e, null, 'personalInfo', 'github')} className="pl-28" />
          </div>
          <Button onClick={() => toggleIcon('github')} className="ml-2">
            {showIcons.github ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none bg-gray-100 dark:bg-gray-700 rounded-md px-1">linkedin.com/in/</span>
            <Input type="text" name="linkedin" placeholder="username" value={personalInfo.linkedin} onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')} className="pl-32" />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none bg-gray-100 dark:bg-gray-700 rounded-md px-1">/</span>
          </div>
          <Button onClick={() => toggleIcon('linkedin')} className="ml-2">
            {showIcons.linkedin ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1">
            <Input type="text" name="phone" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')} />
          </div>
          <Button onClick={() => toggleIcon('phone')} className="ml-2">
            {showIcons.phone ? <Eye /> : <EyeOff />}
          </Button>
        </div>
    </div>
  );
};

export default PersonalInfo;