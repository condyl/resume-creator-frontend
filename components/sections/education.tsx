import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MonthPickerPopover from '../month-picker-popover';
import { format } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface EducationProps {
  education: {
    school: string;
    degree: string;
    location: string;
    coursework: string;
  }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: string, field: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
}

const Education: React.FC<EducationProps> = ({ education, handleChange, removeField, addField }) => {
  const [dates, setDates] = useState<{ startDate: string, endDate: string }[]>(education.map(() => ({ startDate: '', endDate: '' })));

  const handleDateChange = (date: Date | "Present", index: number, field: string) => {
    const value = date === "Present" ? "Present" : date.toISOString();
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);

    const formattedStartDate = newDates[index].startDate === "Present" ? "Present" : format(new Date(newDates[index].startDate), "MMM yyyy");
    const formattedEndDate = newDates[index].endDate === "Present" ? "Present" : format(new Date(newDates[index].endDate), "MMM yyyy");
    const combinedDates = `${formattedStartDate} - ${formattedEndDate}`;
    
    const event = {
      target: {
        value: combinedDates
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event, index, 'education', 'dates');
  };

  return (
    <div>
      {education.map((edu, index) => (
        <div key={index}>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="School" value={edu.school} onChange={(e) => handleChange(e, index, 'education', 'school')} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center">?</TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the name of the school</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education', 'degree')} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center">?</TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the degree obtained</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <MonthPickerPopover placeholderText='Start Date' onDateChange={(date) => handleDateChange(date, index, 'startDate')} />
              <div className="mx-1"></div>
              <MonthPickerPopover placeholderText='End Date' showPresent={true} onDateChange={(date) => handleDateChange(date, index, 'endDate')} className="ml-4" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center">?</TooltipTrigger>
                  <TooltipContent>
                    <p>Select the start and end dates</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleChange(e, index, 'education', 'location')} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center">?</TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the location of the school</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
                <Textarea placeholder="Coursework" value={edu.coursework} onChange={(e) => handleChange(e, index, 'education', 'coursework')} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center">?</TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the coursework details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button type="button" variant={"destructive"} onClick={() => removeField(index, 'education')}>Remove</Button>
          <hr className="my-4" />
        </div>
      ))}
      <Button type="button" onClick={() => addField('education')}>Add Education</Button>
    </div>
  );
};

export default Education;