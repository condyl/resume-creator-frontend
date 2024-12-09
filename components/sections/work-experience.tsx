import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MonthPickerPopover from '../month-picker-popover';
import { format } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { X, Plus, Brain } from 'lucide-react';
import axios from 'axios';
import AIImprovementButton from '@/components/ui/ai-improvement-button';
import { BASE_URL } from '@/config';

interface WorkExperienceProps {
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    details: string[];
  }[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, index: number, section: string, field: string) => void;
  handleDetailChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => void;
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

  const handleImproveText = async (text: string, index: number, detailIndex: number) => {
    if (!text) {
      console.error('No text provided');
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/improve-text`, { text }, { headers: { 'Content-Type': 'application/json' } });
      const improvedText = response.data.improvedText;
      const event = {
        target: {
          value: improvedText
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleDetailChange(event, index, detailIndex, 'workExperience');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error improving text:', error.response.data);
      } else {
        console.error('Error improving text:', error);
      }
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
            <div key={detailIndex} className="pb-2 flex items-center relative">
              <div className="w-full p-1 relative flex items-center">
                <div className="relative w-full">
                  <Textarea placeholder="Detail" value={detail} onChange={(e) => handleDetailChange(e, index, detailIndex, 'workExperience')} className="pr-10" />
                  <AIImprovementButton text={detail} onTextImproved={(improvedText) => {
                    const event = {
                      target: {
                        value: improvedText
                      }
                    } as React.ChangeEvent<HTMLTextAreaElement>;
                    handleDetailChange(event, index, detailIndex, 'workExperience');
                  }} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant={"destructive"} className="ml-2" onClick={() => removeDetail(index, detailIndex, 'workExperience')}><X /></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Detail</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
            <div className="pb-2 flex items-center">
            <Button type="button" onClick={() => addDetail(index, 'workExperience')}><Plus /> Add Detail</Button>
            </div>
            <div className="pb-2 flex items-center">
            <Button type="button" variant={"destructive"} onClick={() => removeField(index, 'workExperience')}><X /> Remove Work Experience</Button>
            </div>
          <hr className="my-4" />
        </div>
      ))}
      <Button type="button" onClick={() => addField('workExperience')}><Plus /> Add Work Experience</Button>
    </div>
  );
};

export default WorkExperience;