export interface PersonalInfoType {
  name: string;
  email: string;
  github: string;
  website: string;
  linkedin: string;
  phone: string;
}

export interface EducationType {
  school: string;
  degree: string;
  program: string;
  location: string;
  coursework: string;
  startDate: string;
  endDate: string;
  showCoursework: boolean;
}

export interface WorkExperienceType {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string[];
}

export interface ProjectType {
  name: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  details: string[];
  startDate: string;
  endDate: string;
  showDate: boolean;
}

export interface SkillsType {
  languages: string;
  frameworks: string;
  tools: string;
}

export interface SavedResumeType {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  personal_info: PersonalInfoType;
  education: EducationType[];
  work_experience: WorkExperienceType[];
  projects: ProjectType[];
  skills: SkillsType;
  show_icons: {
    email: boolean;
    github: boolean;
    linkedin: boolean;
    phone: boolean;
    website: boolean;
  };
} 