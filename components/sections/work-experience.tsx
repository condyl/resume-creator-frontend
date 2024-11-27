import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MonthPickerPopover from '../month-picker-popover';
import { format } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { X, HelpCircle, Plus } from 'lucide-react';

interface WorkExperienceProps {
  workExperience: Array<{
    company: string;
    position: string;
    location: string;
    dates: string;
    details: string[];
  }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number, section: string, field: string) => void;
  handleDetailChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => void;
  removeField: (index: number, section: string) => void;
  addField: (section: string) => void;
  addDetail: (index: number, section: string) => void;
  removeDetail: (index: number, detailIndex: number, section: string) => void;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ workExperience, handleChange, handleDetailChange, removeField, addField, addDetail, removeDetail }) => {
  const [dates, setDates] = useState<{ startDate: string, endDate: string }[]>(workExperience.map(() => ({ startDate: '', endDate: '' })));

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
      handleChange(event, index, 'workExperience', 'dates');
    }
  };

  return (
    <div>
      {workExperience.map((work, index) => (
        <div key={index}>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Company" value={work.company} onChange={(e) => handleChange(e, index, 'workExperience', 'company')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Position" value={work.position} onChange={(e) => handleChange(e, index, 'workExperience', 'position')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <MonthPickerPopover placeholderText='Start Date' onDateChange={(date) => handleDateChange(date, index, 'startDate')} />
              <div className="mx-1"></div>
              <MonthPickerPopover placeholderText='End Date' showPresent={true} onDateChange={(date) => handleDateChange(date, index, 'endDate', true)} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <Input type="text" placeholder="Location" value={work.location} onChange={(e) => handleChange(e, index, 'workExperience', 'location')} />
            </div>
          </div>
          <div className="pb-2 flex items-center">
            <div className="w-full p-1 flex items-center">
              <h3 className="text-md font-semibold">Details</h3>
            </div>
          </div>
          {work.details.map((detail, detailIndex) => (
            <div key={detailIndex} className="pb-2 flex items-center">
              <div className="w-full p-1 pl-1 flex items-center">
                <Textarea placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'workExperience')} />
                <Button type="button" variant={"destructive"} size={"icon"} className="ml-2" onClick={() => removeDetail(index, detailIndex, 'workExperience')}><X /> Remove Detail</Button>
              </div>
            </div>
          ))}
            <div className="pb-2 flex items-center">
            <Button type="button" size={"icon"} onClick={() => addDetail(index, 'workExperience')}><Plus /> Add Detail</Button>
            </div>
            <div className="pb-2 flex items-center">
            <Button type="button" variant={"destructive"} size={"icon"} onClick={() => removeField(index, 'workExperience')}><X /> Remove Work Experience</Button>
            </div>
          <hr className="my-4" />
        </div>
      ))}
      <Button type="button" size={"icon"} onClick={() => addField('workExperience')}><Plus /> Add Work Experience</Button>
    </div>
  );
};

export default WorkExperience;