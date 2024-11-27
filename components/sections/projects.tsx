import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, HelpCircle } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ProjectsProps {
  projects: Array<{
    title: string;
    link: string;
    technologies: string;
    details: string[];
  }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, section: string, field: string) => void;
  handleDetailChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
  addDetail: (index: number, section: string) => void;
  removeDetail: (index: number, detailIndex: number, section: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => (
  <div>
    {projects.map((project, index) => (
      <div key={index}>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 flex items-center">
            <Input type="text" placeholder="Title" value={project.title} onChange={(e) => handleChange(e, index, 'projects', 'title')} />
          </div>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 flex items-center">
            <Input type="text" placeholder="Link" value={project.link} onChange={(e) => handleChange(e, index, 'projects', 'link')} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center"><HelpCircle /></TooltipTrigger>
                <TooltipContent>
                  <p>Hyperlinked in project title</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 flex items-center">
            <Input type="text" placeholder="Technologies" value={project.technologies} onChange={(e) => handleChange(e, index, 'projects', 'technologies')} />
          </div>
        </div>
        <div className="pb-2 flex items-center">
          <div className="w-full p-1 flex items-center">
            <h3 className="text-md font-semibold">Details</h3>
          </div>
        </div>
        {project.details.map((detail, detailIndex) => (
          <div key={detailIndex} className="pb-2 flex items-center">
            <div className="w-full p-1 pl-1 flex items-center">
              <Textarea placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'projects')} />
              <Button type="button" variant={"destructive"} size={"icon"} className="ml-2" onClick={() => removeDetail(index, detailIndex, 'projects')}><X /> Remove Detail</Button>
            </div>
          </div>
        ))}
        <div className="pb-2 flex items-center">
          <Button type="button" size={"icon"} onClick={() => addDetail(index, 'projects')}><Plus /> Add Detail</Button>
        </div>
        <div className="pb-2 flex items-center">
          <Button type="button" variant={"destructive"} size={"icon"} onClick={() => removeField(index, 'projects')}><X /> Remove Project</Button>
        </div>
        <hr className="my-4" />
      </div>
    ))}
    <Button type="button" size={"icon"} onClick={() => addField('projects')}><Plus /> Add Project</Button>
  </div>
);

export default Projects;