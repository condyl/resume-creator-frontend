import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MonthPickerPopover from '../month-picker-popover';
import { format } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { X, HelpCircle, Plus } from 'lucide-react';

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

  const handleDateChange = (date: Date | "Present", index: number, field: string, formatDate: boolean = false) => {
    const value = date === "Present" ? "Present" : date.toISOString();
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);

    if (formatDate) {
      const formattedStartDate = newDates[index].startDate === "Present" ? "Present" : format(new Date(newDates[index].startDate), "MMM yyyy");
      const formattedEndDate = newDates[index].endDate === "Present" ? "Present" : format(new Date(newDates[index].endDate), "MMM yyyy");
      const combinedDates = `${formattedStartDate} - ${formattedEndDate}`;
  
      const event = {
        target: {
          value: combinedDates
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(event, index, 'education', 'dates');
    }
  };

  return (
    <div>
      {education.map((edu, index) => (
        <div key={index}>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="School" value={edu.school} onChange={(e) => handleChange(e, index, 'education', 'school')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education', 'degree')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <MonthPickerPopover placeholderText='Start Date' onDateChange={(date) => handleDateChange(date, index, 'startDate')} />
              <div className="mx-1"></div>
              <MonthPickerPopover placeholderText='End Date' showPresent={true} onDateChange={(date) => handleDateChange(date, index, 'endDate', true)} className="ml-4"  />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleChange(e, index, 'education', 'location')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
                <Textarea placeholder="Coursework" value={edu.coursework} onChange={(e) => handleChange(e, index, 'education', 'coursework')} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-2 p-2 bg-[hsl(var(--primary))] border rounded-full text-[hsl(var(--primary-foreground))] w-8 h-8 flex items-center justify-center"><HelpCircle /></TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the coursework details (comma separated)</p>
                    <p>E.g. Data Structures, Algorithms, ...</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button type="button" variant={"destructive"} size={"icon"} onClick={() => removeField(index, 'education')}><X /> Remove Education</Button>
          <hr className="my-4" />
        </div>
      ))}
      <Button type="button" size={"icon"} onClick={() => addField('education')}>
        <Plus /> Add Education
      </Button>
    </div>
  );
};

export default Education;