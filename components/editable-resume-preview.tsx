import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PersonalInfoType, EducationType, WorkExperienceType, ProjectType, SkillsType, ShowIconsType } from '@/lib/types';
import { EditableText } from './ui/editable-text';
import { Button } from './ui/button';
import { Settings2, Plus } from 'lucide-react';
import { MonthPicker } from './ui/month-picker';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ReactDOM from 'react-dom/client';

// Constants for page dimensions (in inches, converted to pixels)
const INCH_TO_PX = 96; // Standard 96 DPI
const PAGE_WIDTH = 8.5 * INCH_TO_PX;
const PAGE_HEIGHT = 11 * INCH_TO_PX;
const MARGIN_SIDE = 0.8 * INCH_TO_PX;
const MARGIN_TOP = 0.8 * INCH_TO_PX;
const MARGIN_BOTTOM = 0.5 * INCH_TO_PX;
const BULLET_INDENT = "0.15in"; // Matches LaTeX template's leftmargin
const LINE_HEIGHT = 1.15; // Tighter line height to match PDF
const FONT_SIZE = "11.5pt"; // Increased from 11pt to match visual size of LaTeX

// Constants for vertical spacing
const MAX_SECTION_MARGIN = 16; // maximum margin between sections in pixels
const MIN_SECTION_MARGIN = 4; // minimum margin between sections
const MAX_ITEM_MARGIN = 8; // maximum margin between items (education entries, jobs, projects)
const MIN_ITEM_MARGIN = 2; // minimum margin between items
const MAX_LIST_MARGIN = 4; // maximum margin between bullet points
const MIN_LIST_MARGIN = 1; // minimum margin between bullet points

// Update constants for tighter spacing
const SECTION_SPACING = "0.8rem"; // Space between sections
const ITEM_SPACING = "0.3rem"; // Space between items within sections
const LIST_SPACING = "0.1rem"; // Space between bullet points

interface PageProps {
  children: React.ReactNode;
  isLastPage?: boolean;
}

const Page: React.FC<PageProps> = ({ children, isLastPage = false }) => (
  <div 
    className={cn(
      "bg-white border border-gray-200 shadow-md flex-shrink-0 text-black",
      isLastPage ? "mb-0" : "mb-8"
    )}
    style={{
      width: `${PAGE_WIDTH}px`,
      height: `${PAGE_HEIGHT}px`,
      paddingLeft: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
      paddingRight: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
      paddingTop: `${MARGIN_TOP - (0.5 * INCH_TO_PX)}px`,
      paddingBottom: `${MARGIN_BOTTOM}px`,
      overflow: 'hidden'
    }}
  >
    <div 
      className="font-[times] text-black"
      style={{ 
        fontSize: FONT_SIZE,
        lineHeight: LINE_HEIGHT
      }}
    >
      {children}
    </div>
  </div>
);

// Custom styled month picker that looks like text
const InlineMonthPicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className }) => {
  return (
    <MonthPicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      showIcon={false}
      className={cn(
        "p-0 h-auto min-h-0 border-0 bg-transparent hover:bg-gray-100/50 rounded font-inherit whitespace-nowrap w-auto",
        !value && "text-gray-400 italic",
        className
      )}
    />
  );
};

interface EditableResumePreviewProps {
  personalInfo: PersonalInfoType;
  education: EducationType[];
  workExperience: WorkExperienceType[];
  projects: ProjectType[];
  skills: SkillsType;
  showIcons: ShowIconsType;
  onPersonalInfoChange: (field: keyof PersonalInfoType, value: string) => void;
  onEducationChange: (index: number, field: keyof EducationType, value: string) => void;
  onWorkExperienceChange: (index: number, field: keyof WorkExperienceType, value: string | string[]) => void;
  onProjectChange: (index: number, field: keyof ProjectType, value: string | string[]) => void;
  onSkillsChange: (field: keyof SkillsType, value: string) => void;
  onToggleIcon: (field: keyof ShowIconsType) => void;
}

interface SectionMeasurements {
  education: number;
  experience: number;
  projects: number;
  skills: number;
}

export const EditableResumePreview: React.FC<EditableResumePreviewProps> = ({
  personalInfo,
  education,
  workExperience,
  projects,
  skills,
  showIcons,
  onPersonalInfoChange,
  onEducationChange,
  onWorkExperienceChange,
  onProjectChange,
  onSkillsChange,
  onToggleIcon,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [verticalScale, setVerticalScale] = useState(1);
  
  useEffect(() => {
    const adjustVerticalSpacing = () => {
      if (!contentRef.current) return;
      
      const contentHeight = contentRef.current.scrollHeight;
      const availableHeight = PAGE_HEIGHT - (MARGIN_TOP + MARGIN_BOTTOM);
      
      if (contentHeight > availableHeight) {
        const scale = availableHeight / contentHeight;
        setVerticalScale(Math.max(0.7, scale)); // Allow up to 30% compression
      } else {
        setVerticalScale(1);
      }
    };

    adjustVerticalSpacing();
    window.addEventListener('resize', adjustVerticalSpacing);
    return () => window.removeEventListener('resize', adjustVerticalSpacing);
  }, [personalInfo, education, workExperience, projects, skills]);

  // Calculate dynamic margins based on scale
  const getSectionMargin = () => {
    return Math.max(MIN_SECTION_MARGIN, MAX_SECTION_MARGIN * verticalScale);
  };

  const getItemMargin = () => {
    return Math.max(MIN_ITEM_MARGIN, MAX_ITEM_MARGIN * verticalScale);
  };

  const getListMargin = () => {
    return Math.max(MIN_LIST_MARGIN, MAX_LIST_MARGIN * verticalScale);
  };

  // Update base section and item classes
  const sectionClass = `mb-[${SECTION_SPACING}]`;
  const itemClass = `mb-[${ITEM_SPACING}]`;
  const listItemClass = cn(
    "list-disc",
    "leading-[1.2]",
    `mb-[${LIST_SPACING}]`
  );

  // Render functions
  const renderHeader = () => (
    <div className="text-center mb-3 text-black">
      <EditableText
        value={personalInfo.name}
        onChange={(value: string) => onPersonalInfoChange('name', value)}
        className="text-[28pt] font-bold tracking-[0.05em] mb-0.5 capitalize text-black"
        placeholder="Your Name"
      />
      <div className="flex justify-center items-center gap-2 text-sm text-black">
        {personalInfo.email && (
          <>
            <EditableText
              value={personalInfo.email}
              onChange={(value: string) => onPersonalInfoChange('email', value)}
              placeholder="Email"
              className="hover:underline text-black"
            />
            {(personalInfo.phone || personalInfo.github || personalInfo.linkedin || personalInfo.website) && (
              <span className="text-black">|</span>
            )}
          </>
        )}
        {personalInfo.phone && (
          <>
            <EditableText
              value={personalInfo.phone}
              onChange={(value: string) => onPersonalInfoChange('phone', value)}
              placeholder="Phone"
            />
            {(personalInfo.github || personalInfo.linkedin || personalInfo.website) && (
              <span className="text-black">|</span>
            )}
          </>
        )}
        {personalInfo.github && (
          <>
            <EditableText
              value={personalInfo.github}
              onChange={(value: string) => onPersonalInfoChange('github', value)}
              placeholder="GitHub"
              className="hover:underline text-black"
            />
            {(personalInfo.linkedin || personalInfo.website) && (
              <span className="text-black">|</span>
            )}
          </>
        )}
        {personalInfo.linkedin && (
          <>
            <EditableText
              value={personalInfo.linkedin}
              onChange={(value: string) => onPersonalInfoChange('linkedin', value)}
              placeholder="LinkedIn"
              className="hover:underline text-black"
            />
            {personalInfo.website && <span className="text-black">|</span>}
          </>
        )}
        {personalInfo.website && (
          <EditableText
            value={personalInfo.website}
            onChange={(value: string) => onPersonalInfoChange('website', value)}
            placeholder="Website"
            className="hover:underline text-black"
          />
        )}
      </div>
    </div>
  );

  const renderSection = (title: string) => (
    <h2 
      className="text-[14pt] border-b border-black pb-0 mb-1 text-black"
      style={{
        fontVariant: 'small-caps'
      }}
    >
      {title}
    </h2>
  );

  const renderEducation = () => (
    <section className={`${sectionClass} text-black`}>
      {renderSection('Education')}
      <div className="pl-[0.15in]">
        {education.map((edu, index) => (
          <div key={index} className={itemClass}>
            <div className="flex justify-between items-baseline mb-0">
              <EditableText
                value={edu.school}
                onChange={(value: string) => onEducationChange(index, 'school', value)}
                className="font-bold text-[12pt] text-black"
                placeholder="School Name"
              />
              <EditableText
                value={edu.location}
                onChange={(value: string) => onEducationChange(index, 'location', value)}
                placeholder="Location"
                className="text-right italic text-black"
              />
            </div>
            <div className="flex justify-between items-baseline mb-0">
              <EditableText
                value={edu.degree}
                onChange={(value: string) => onEducationChange(index, 'degree', value)}
                className="italic text-black"
                placeholder="Degree"
              />
              <div className="flex gap-1 italic text-right text-black">
                <InlineMonthPicker
                  value={edu.startDate}
                  onChange={(value: string) => onEducationChange(index, 'startDate', value)}
                  placeholder="Start Date"
                />
                <span>-</span>
                <InlineMonthPicker
                  value={edu.endDate}
                  onChange={(value: string) => onEducationChange(index, 'endDate', value)}
                  placeholder="End Date"
                />
              </div>
            </div>
            {edu.showCoursework && edu.coursework && (
              <div className="mt-0.5">
                <span className="font-bold text-black">Relevant Coursework: </span>
                <EditableText
                  value={edu.coursework}
                  onChange={(value: string) => onEducationChange(index, 'coursework', value)}
                  placeholder="Relevant coursework"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const renderExperience = () => (
    <section className={`${sectionClass} text-black`}>
      {renderSection('Experience')}
      <div className="pl-[0.15in]">
        {workExperience.map((work, index) => (
          <div key={index} className={itemClass}>
            <div className="flex justify-between items-baseline mb-0">
              <EditableText
                value={work.position}
                onChange={(value: string) => onWorkExperienceChange(index, 'position', value)}
                className="font-bold text-black"
                placeholder="Position"
              />
              <div className="flex gap-1 italic text-right text-black">
                <InlineMonthPicker
                  value={work.startDate}
                  onChange={(value: string) => onWorkExperienceChange(index, 'startDate', value)}
                  placeholder="Start Date"
                  className="text-black"
                />
                <span className="text-black">-</span>
                <InlineMonthPicker
                  value={work.endDate}
                  onChange={(value: string) => onWorkExperienceChange(index, 'endDate', value)}
                  placeholder="End Date"
                  className="text-black"
                />
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-0.5">
              <EditableText
                value={work.company}
                onChange={(value: string) => onWorkExperienceChange(index, 'company', value)}
                className="italic text-black"
                placeholder="Company Name"
              />
              <EditableText
                value={work.location}
                onChange={(value: string) => onWorkExperienceChange(index, 'location', value)}
                placeholder="Location"
                className="text-right italic text-black"
              />
            </div>
            <ul className="list-disc pl-[calc(0.15in+0.15in)] space-y-[0.1rem] leading-[1.2] text-black">
              {work.details.map((detail, detailIndex) => (
                <li key={detailIndex}>
                  <EditableText
                    value={detail}
                    onChange={(value: string) => {
                      const newDetails = [...work.details];
                      newDetails[detailIndex] = value;
                      onWorkExperienceChange(index, 'details', newDetails);
                    }}
                    placeholder="Add work detail"
                    className="text-black"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className={sectionClass}>
      {renderSection('Projects')}
      <div className="pl-[0.15in]">
        {projects.map((project, index) => (
          <div key={index} className={itemClass}>
            <div className="flex justify-between items-baseline mb-0.5">
              <div className="flex items-baseline gap-2">
                <EditableText
                  value={project.name}
                  onChange={(value: string) => onProjectChange(index, 'name', value)}
                  className="font-bold text-black"
                  placeholder="Project Name"
                />
                <span> | </span>
                <EditableText
                  value={project.technologies}
                  onChange={(value: string) => onProjectChange(index, 'technologies', value)}
                  placeholder="Technologies"
                  className="text-sm italic text-black"
                />
              </div>
              {project.showDate && (
                <div className="flex gap-1 text-sm text-black text-right">
                  <InlineMonthPicker
                    value={project.startDate}
                    onChange={(value: string) => onProjectChange(index, 'startDate', value)}
                    placeholder="Start Date"
                  />
                  <span>-</span>
                  <InlineMonthPicker
                    value={project.endDate}
                    onChange={(value: string) => onProjectChange(index, 'endDate', value)}
                    placeholder="End Date"
                  />
                </div>
              )}
            </div>
            <ul className="list-disc pl-[calc(0.15in+0.15in)] space-y-[0.1rem] leading-[1.2] text-black">
              {project.details.map((detail, detailIndex) => (
                <li key={detailIndex}>
                  <EditableText
                    value={detail}
                    onChange={(value: string) => {
                      const newDetails = [...project.details];
                      newDetails[detailIndex] = value;
                      onProjectChange(index, 'details', newDetails);
                    }}
                    placeholder="Add project detail"
                    className="text-black"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section className={`${sectionClass} text-black`}>
      {renderSection('Skills')}
      <div className="pl-[0.15in] space-y-[0.1rem]">
        <div>
          <span className="font-bold text-black">Programming Languages: </span>
          <EditableText
            value={skills.languages}
            onChange={(value: string) => onSkillsChange('languages', value)}
            placeholder="Add programming languages"
            className="inline text-black"
          />
        </div>
        <div>
          <span className="font-bold text-black">Frameworks & Libraries: </span>
          <EditableText
            value={skills.frameworks}
            onChange={(value: string) => onSkillsChange('frameworks', value)}
            placeholder="Add frameworks"
            className="inline text-black"
          />
        </div>
        <div>
          <span className="font-bold text-black">Tools & Technologies: </span>
          <EditableText
            value={skills.tools}
            onChange={(value: string) => onSkillsChange('tools', value)}
            placeholder="Add tools"
            className="inline text-black"
          />
        </div>
      </div>
    </section>
  );

  const renderSettingsMenu = () => (
    <div className="absolute right-4 top-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onToggleIcon('email')}>
            {showIcons.email ? 'Hide' : 'Show'} Email Icon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleIcon('phone')}>
            {showIcons.phone ? 'Hide' : 'Show'} Phone Icon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleIcon('github')}>
            {showIcons.github ? 'Hide' : 'Show'} GitHub Icon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleIcon('linkedin')}>
            {showIcons.linkedin ? 'Hide' : 'Show'} LinkedIn Icon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleIcon('website')}>
            {showIcons.website ? 'Hide' : 'Show'} Website Icon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="mx-auto bg-background min-h-screen">
      {renderSettingsMenu()}
      
      <div className="flex flex-col items-center py-8 px-4">
        <div 
          className="bg-white border border-gray-200 shadow-md relative"
          style={{
            width: `${PAGE_WIDTH}px`,
            height: `${PAGE_HEIGHT}px`,
            paddingLeft: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
            paddingRight: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
            paddingTop: `${MARGIN_TOP - (0.5 * INCH_TO_PX)}px`,
            paddingBottom: `${MARGIN_BOTTOM}px`,
            overflow: 'hidden'
          }}
        >
          <div 
            ref={contentRef} 
            className="font-[times] text-black"
            style={{ 
              fontSize: FONT_SIZE,
              lineHeight: LINE_HEIGHT,
              height: '100%'
            }}
          >
            {renderHeader()}
            {renderEducation()}
            {renderExperience()}
            {renderProjects()}
            {renderSkills()}
          </div>
        </div>
      </div>
    </div>
  );
}; 