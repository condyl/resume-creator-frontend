import React from 'react';
import { Input } from '@/components/ui/input';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

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
    <div className="pb-2 flex items-center">
      <div className="w-full p-1 flex items-center">
        <Input type="text" placeholder="Languages" value={skills.languages} onChange={(e) => handleChange(e, null, 'skills', 'languages')} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center"><HelpCircle /></TooltipTrigger>
            <TooltipContent>
              <p>Enter programming languages you are proficient in.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <div className="pb-2 flex items-center">
      <div className="w-full p-1 flex items-center">
        <Input type="text" placeholder="Frameworks" value={skills.frameworks} onChange={(e) => handleChange(e, null, 'skills', 'frameworks')} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center"><HelpCircle /></TooltipTrigger>
            <TooltipContent>
              <p>Enter frameworks and libraries you have experience with.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <div className="pb-2 flex items-center">
      <div className="w-full p-1 flex items-center">
        <Input type="text" placeholder="Tools" value={skills.tools} onChange={(e) => handleChange(e, null, 'skills', 'tools')} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center"><HelpCircle /></TooltipTrigger>
            <TooltipContent>
              <p>Enter tools and technologies you are familiar with.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
);

export default Skills;