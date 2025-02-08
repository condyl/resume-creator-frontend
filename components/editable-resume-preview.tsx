import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PersonalInfoType, EducationType, WorkExperienceType, ProjectType, SkillsType, ShowIconsType } from '@/lib/types';
import { EditableText } from './ui/editable-text';
import { Button } from './ui/button';
import { Settings2, Plus, EyeOff, X, AlertCircle } from 'lucide-react';
import { MonthPicker } from './ui/month-picker';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ReactDOM from 'react-dom/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AIImprovementButton from './ui/ai-improvement-button';

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
      "bg-white border border-gray-200 shadow-md flex-shrink-0 text-black w-full",
      isLastPage ? "mb-0" : "mb-8"
    )}
    style={{
      width: `${PAGE_WIDTH}px`,
      minHeight: `${PAGE_HEIGHT}px`,
      paddingLeft: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
      paddingRight: `${MARGIN_SIDE - (0.5 * INCH_TO_PX)}px`,
      paddingTop: `${MARGIN_TOP - (0.5 * INCH_TO_PX)}px`,
      paddingBottom: `${MARGIN_BOTTOM}px`
    }}
  >
    <div 
      className="font-[times] text-black h-full"
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
        "p-0 h-auto min-h-0 border-0 bg-transparent hover:bg-gray-100/50 rounded font-inherit whitespace-nowrap w-auto text-black dark:text-black",
        !value && "text-gray-400 dark:text-gray-400 italic",
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
  onEducationChange: (index: number, field: keyof EducationType, value: string | boolean) => void;
  onWorkExperienceChange: (index: number, field: keyof WorkExperienceType, value: string | string[]) => void;
  onProjectChange: (index: number, field: keyof ProjectType, value: string | string[]) => void;
  onSkillsChange: (field: keyof SkillsType, value: string) => void;
  onToggleIcon: (field: keyof ShowIconsType) => void;
  onRemoveEducation: (index: number) => void;
  onRemoveWorkExperience: (index: number) => void;
  onRemoveProject: (index: number) => void;
  onAddEducation: () => void;
  onAddWorkExperience: () => void;
  onAddProject: () => void;
  onAddWorkDetail: (index: number) => void;
  onAddProjectDetail: (index: number) => void;
  onRemoveWorkDetail: (workIndex: number, detailIndex: number) => void;
  onRemoveProjectDetail: (projectIndex: number, detailIndex: number) => void;
}

interface SectionMeasurements {
  education: number;
  experience: number;
  projects: number;
  skills: number;
}

const PreviewDisclaimer: React.FC = () => (
  <div className="flex flex-col gap-2 w-64 p-4 bg-muted/50 rounded-lg mr-6 h-fit sticky top-4">
    <div className="flex items-center gap-2 text-muted-foreground">
      <AlertCircle className="h-5 w-5" />
      <h3 className="font-semibold">Preview Notice</h3>
    </div>
    <p className="text-sm text-muted-foreground">
      This preview is a close representation of your resume, but the final PDF may have slight variations in spacing, alignment, and formatting.
    </p>
  </div>
);

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
  onRemoveEducation,
  onRemoveWorkExperience,
  onRemoveProject,
  onAddEducation,
  onAddWorkExperience,
  onAddProject,
  onAddWorkDetail,
  onAddProjectDetail,
  onRemoveWorkDetail,
  onRemoveProjectDetail,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showHeaderItems, setShowHeaderItems] = useState(false);
  const [showEducationItems, setShowEducationItems] = useState(false);
  
  // Remove vertical scaling logic since we want content to flow naturally
  const sectionClass = `mb-[${SECTION_SPACING}]`;
  const itemClass = `mb-[${ITEM_SPACING}]`;
  const listItemClass = cn(
    "list-disc",
    "leading-[1.2]",
    `mb-[${LIST_SPACING}]`
  );

  // Update header handlers
  const handleHeaderMouseEnter = () => {
    setShowHeaderItems(true);
  };

  const handleHeaderMouseLeave = () => {
    setShowHeaderItems(false);
  };

  const renderHeaderItem = (
    field: keyof ShowIconsType,
    content: React.ReactNode,
    separator?: boolean
  ) => {
    if (!personalInfo[field]) return null;

    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className={cn(
                "relative",
                !showIcons[field] && !showHeaderItems && "hidden",
                !showIcons[field] && showHeaderItems && "opacity-40"
              )}
            >
              {content}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleIcon(field)}
              className="text-xs"
            >
              <EyeOff className="h-3 w-3 mr-1" />
              {showIcons[field] ? 'Hide' : 'Show'} {field}
            </Button>
          </PopoverContent>
        </Popover>
        {separator && (
          <span className={cn(
            "text-black",
            (!showIcons[field] && !showHeaderItems) && "hidden",
            (!showIcons[field] && showHeaderItems) && "opacity-40"
          )}>|</span>
        )}
      </>
    );
  };

  const renderHeader = () => (
    <div 
      className="relative pt-4 pb-8 -mt-4 -mb-8"
      onMouseEnter={handleHeaderMouseEnter}
      onMouseLeave={handleHeaderMouseLeave}
    >
      <div className="text-center mb-3 text-black">
        <EditableText
          value={personalInfo.name}
          onChange={(value: string) => onPersonalInfoChange('name', value)}
          className="text-[28pt] font-bold tracking-[0.05em] mb-0.5 capitalize text-black"
          placeholder="Your Name"
        />
        <div className="flex justify-center items-center gap-2 text-sm text-black whitespace-nowrap min-w-0 flex-wrap">
          {renderHeaderItem('email', 
            <EditableText
              value={personalInfo.email}
              onChange={(value: string) => onPersonalInfoChange('email', value)}
              placeholder="Email"
              className="hover:underline text-black"
            />,
            !!(personalInfo.phone || personalInfo.github || personalInfo.linkedin || personalInfo.website)
          )}
          
          {renderHeaderItem('phone',
            <EditableText
              value={personalInfo.phone}
              onChange={(value: string) => onPersonalInfoChange('phone', value)}
              placeholder="Phone"
            />,
            !!(personalInfo.github || personalInfo.linkedin || personalInfo.website)
          )}
          
          {renderHeaderItem('github',
            <span className="text-black inline-flex whitespace-nowrap">
              github.com/
              <EditableText
                value={personalInfo.github}
                onChange={(value: string) => onPersonalInfoChange('github', value)}
                placeholder="GitHub"
                className="hover:underline text-black inline"
              />
            </span>,
            !!(personalInfo.linkedin || personalInfo.website)
          )}
          
          {renderHeaderItem('linkedin',
            <span className="text-black inline-flex whitespace-nowrap">
              linkedin.com/in/
              <EditableText
                value={personalInfo.linkedin}
                onChange={(value: string) => onPersonalInfoChange('linkedin', value)}
                placeholder="LinkedIn"
                className="hover:underline text-black inline"
              />
            </span>,
            !!personalInfo.website
          )}
          
          {renderHeaderItem('website',
            <span className="inline-flex whitespace-nowrap">
              <EditableText
                value={personalInfo.website}
                onChange={(value: string) => onPersonalInfoChange('website', value)}
                placeholder="Website"
                className="hover:underline text-black"
              />
            </span>
          )}
        </div>
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

  const renderAddButton = (onClick: () => void, label: string) => (
    <div className="group/add-hover pt-2">
      <div className="h-0 group-hover/add-hover:h-10 overflow-hidden transition-all duration-200">
        <Button
          variant="outline"
          size="sm"
          className="w-full opacity-0 group-hover/add-hover:opacity-100 border-dashed border-gray-300 hover:border-gray-400 bg-white dark:bg-white text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-700"
          onClick={onClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </div>
    </div>
  );

  const renderAddDetailButton = (onClick: () => void) => (
    <li className="list-none h-0 group-hover:h-8 overflow-hidden transition-all duration-200">
      <div className="h-0 group-hover:h-8 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-white dark:bg-white"
          onClick={onClick}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add bullet point
        </Button>
      </div>
    </li>
  );

  const renderRemoveButton = (onClick: () => void) => (
    <Button
      variant="outline"
      size="sm"
      className="absolute -left-10 top-0 h-full opacity-0 group-hover:opacity-100 border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-sm px-2 mr-2 bg-white dark:bg-white"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  );

  const renderSettingsButton = (field: keyof ShowIconsType) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggleIcon(field)}
      className="h-4 w-4 opacity-0 group-hover:opacity-100 bg-white dark:bg-white text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-700"
    >
      <Settings2 className="h-3 w-3" />
    </Button>
  );

  const renderEducation = () => (
    <section 
      className={`${sectionClass} text-black relative`}
      onMouseEnter={() => setShowEducationItems(true)}
      onMouseLeave={() => setShowEducationItems(false)}
    >
      <div className="relative">
        {renderSection('Education')}
        <div className="pl-[0.15in]">
          {education.map((edu, index) => (
            <div 
              key={index} 
              className={`${itemClass} group relative`}
            >
              {renderRemoveButton(() => onRemoveEducation(index))}
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
              <Popover>
                <PopoverTrigger asChild>
                  <div 
                    className={cn(
                      "mt-0.5",
                      !edu.showCoursework && !showEducationItems && "hidden",
                      !edu.showCoursework && showEducationItems && "opacity-40"
                    )}
                  >
                    <span className="font-bold text-black">Relevant Coursework: </span>
                    <EditableText
                      value={edu.coursework}
                      onChange={(value: string) => onEducationChange(index, 'coursework', value)}
                      placeholder="Relevant coursework"
                      className="text-black"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" sideOffset={5}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEducationChange(index, 'showCoursework', !edu.showCoursework)}
                    className="text-xs"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    {edu.showCoursework ? 'Hide' : 'Show'} coursework
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
          {renderAddButton(onAddEducation, "Add Education")}
        </div>
      </div>
    </section>
  );

  const renderWorkExperienceDetails = (work: WorkExperienceType, index: number) => (
    <ul className="list-disc pl-[calc(0.15in+0.15in)] space-y-[0.1rem] leading-[1.2] text-black pb-2">
      {work.details.map((detail, detailIndex) => (
        <li key={detailIndex} className="group/bullet relative list-none">
          <div className="flex items-start gap-2 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -left-7 top-0 opacity-0 group-hover/bullet:opacity-100 h-6 w-6 p-0 bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 z-10"
              onClick={() => onRemoveWorkDetail(index, detailIndex)}
            >
              <X className="h-3 w-3 text-red-500 dark:text-red-500" />
            </Button>
            <div className="flex-1 relative before:content-['•'] before:absolute before:-left-4 before:top-0 before:group-hover/bullet:opacity-0">
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
            </div>
            <div className="opacity-0 group-hover/bullet:opacity-100 transition-opacity">
              <AIImprovementButton
                text={detail}
                onTextImproved={(improvedText) => {
                  const newDetails = [...work.details];
                  newDetails[detailIndex] = improvedText;
                  onWorkExperienceChange(index, 'details', newDetails);
                }}
                className="h-6 w-6"
              />
            </div>
          </div>
        </li>
      ))}
      {renderAddDetailButton(() => onAddWorkDetail(index))}
    </ul>
  );

  const renderProjectDetails = (project: ProjectType, index: number) => (
    <ul className="list-disc pl-[calc(0.15in+0.15in)] space-y-[0.1rem] leading-[1.2] text-black pb-2">
      {project.details.map((detail, detailIndex) => (
        <li key={detailIndex} className="group/bullet relative list-none">
          <div className="flex items-start gap-2 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -left-7 top-0 opacity-0 group-hover/bullet:opacity-100 h-6 w-6 p-0 bg-white hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 z-10"
              onClick={() => onRemoveProjectDetail(index, detailIndex)}
            >
              <X className="h-3 w-3 text-red-500 dark:text-red-500" />
            </Button>
            <div className="flex-1 relative before:content-['•'] before:absolute before:-left-4 before:top-0 before:group-hover/bullet:opacity-0">
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
            </div>
            <div className="opacity-0 group-hover/bullet:opacity-100 transition-opacity">
              <AIImprovementButton
                text={detail}
                onTextImproved={(improvedText) => {
                  const newDetails = [...project.details];
                  newDetails[detailIndex] = improvedText;
                  onProjectChange(index, 'details', newDetails);
                }}
                className="h-6 w-6"
              />
            </div>
          </div>
        </li>
      ))}
      {renderAddDetailButton(() => onAddProjectDetail(index))}
    </ul>
  );

  const renderExperience = () => (
    <section className={`${sectionClass} text-black group/experience`}>
      {renderSection('Experience')}
      <div className="pl-[0.15in]">
        {workExperience.map((work, index) => (
          <div key={index} className={`${itemClass} group relative`}>
            {renderRemoveButton(() => onRemoveWorkExperience(index))}
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
            {renderWorkExperienceDetails(work, index)}
          </div>
        ))}
        {renderAddButton(onAddWorkExperience, "Add Experience")}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className={sectionClass}>
      {renderSection('Projects')}
      <div className="pl-[0.15in]">
        {projects.map((project, index) => (
          <div key={index} className={`${itemClass} group relative`}>
            {renderRemoveButton(() => onRemoveProject(index))}
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
            {renderProjectDetails(project, index)}
          </div>
        ))}
        {renderAddButton(onAddProject, "Add Project")}
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
        <Page>
          <div className="space-y-4">
            {renderHeader()}
            {renderEducation()}
            {renderExperience()}
            {renderProjects()}
            {renderSkills()}
          </div>
        </Page>
      </div>
    </div>
  );
}; 