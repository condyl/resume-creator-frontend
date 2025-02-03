"use client";

import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import PersonalInfo from "@/components/sections/personal-info";
import Education from "@/components/sections/education";
import WorkExperience from "@/components/sections/work-experience";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  FileCode,
  UserCircle,
  AlertCircle,
} from "lucide-react";
import { BASE_URL } from "@/lib/constants";
import PDFViewer from "@/components/pdf-viewer";
import { pdfjs } from "react-pdf";
import { SaveResumeDialog } from "@/components/save-resume-dialog";
import { SavedResumesDialog } from "@/components/saved-resumes-dialog";
import {
  SavedResumeType,
  EducationType,
  WorkExperienceType,
  ProjectType,
  SkillsType,
} from "@/lib/types";
import { useAuth } from "@/lib/AuthContext";
import { ResumeStatusBar } from "@/components/resume-status-bar";
import { SectionProgress } from "@/components/section-progress";
import { supabase } from "@/lib/supabase";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import Link from "next/link";
import { EditableResumePreview } from "@/components/editable-resume-preview";
import { parseISO, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PersonalInfoType {
  name: string;
  email: string;
  github: string;
  website: string;
  linkedin: string;
  phone: string;
}

type ShowIconsType = {
  email: boolean;
  github: boolean;
  linkedin: boolean;
  phone: boolean;
  website: boolean;
};

const Home: React.FC = () => {
  const { user } = useAuth();

  // Helper function to safely check if a string is filled
  const isFieldFilled = (value: string) => {
    return typeof value === "string" && value.trim().length > 0;
  };

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    name: "",
    email: "",
    github: "",
    website: "",
    linkedin: "",
    phone: "",
  });
  const [showIcons, setShowIcons] = useState<ShowIconsType>({
    email: true,
    github: true,
    linkedin: true,
    phone: true,
    website: true,
  });
  const [education, setEducation] = useState<EducationType[]>([
    {
      school: "",
      degree: "",
      program: "",
      location: "",
      coursework: "",
      startDate: "",
      endDate: "",
      showCoursework: true,
    },
  ]);
  const [workExperience, setWorkExperience] = useState<WorkExperienceType[]>([
    {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      details: [""],
    },
  ]);
  const [projects, setProjects] = useState<ProjectType[]>([
    {
      name: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      details: [""],
      startDate: "",
      endDate: "",
      showDate: false,
    },
  ]);
  const [skills, setSkills] = useState<SkillsType>({
    languages: "",
    frameworks: "",
    tools: "",
  });
  const [resumeUrl, setResumeUrl] = useState("/blank.pdf");
  const [latexSource, setLatexSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
  const [currentResume, setCurrentResume] = useState<
    SavedResumeType | undefined
  >(undefined);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [isDirty, setIsDirty] = useState(false);

  const toggleSlideout = () => {
    setIsSlideoutOpen((prev) => !prev);
  };

  const toggleIcon = (field: keyof typeof showIcons) => {
    setShowIcons((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null,
    section: string,
    field: string
  ) => {
    setIsDirty(true);
    const value = e.target.value;
    if (section === "personalInfo") {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    } else if (section === "skills") {
      setSkills((prev) => ({ ...prev, [field]: value }));
    } else {
      if (section === "education") {
        setEducation((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [field]:
                    field === "showCoursework" ? value === "true" : value,
                }
              : item
          )
        );
      } else if (section === "workExperience") {
        setWorkExperience((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          )
        );
      } else if (section === "projects") {
        setProjects((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: field === "showDate" ? value === "true" : value,
                }
              : item
          )
        );
      }
    }
  };

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    detailIndex: number,
    section: string
  ) => {
    const value = e.target.value;
    if (section === "workExperience") {
      setWorkExperience((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                details: item.details.map((detail, j) =>
                  j === detailIndex ? value : detail
                ),
              }
            : item
        )
      );
    } else if (section === "projects") {
      setProjects((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                details: item.details.map((detail, j) =>
                  j === detailIndex ? value : detail
                ),
              }
            : item
        )
      );
    }
  };

  const addField = (section: string) => {
    if (section === "education") {
      setEducation([
        ...education,
        {
          school: "",
          degree: "",
          program: "",
          location: "",
          coursework: "",
          startDate: "",
          endDate: "",
          showCoursework: true,
        },
      ]);
    } else if (section === "workExperience") {
      setWorkExperience([
        ...workExperience,
        {
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          details: [""],
        },
      ]);
    } else if (section === "projects") {
      setProjects([
        ...projects,
        {
          name: "",
          technologies: "",
          liveUrl: "",
          githubUrl: "",
          details: [""],
          startDate: "",
          endDate: "",
          showDate: false,
        },
      ]);
    }
  };

  const addDetail = (index: number, section: string) => {
    const updatedSection: (WorkExperienceType | ProjectType)[] = [
      ...(section === "workExperience" ? workExperience : projects),
    ];
    updatedSection[index].details.push("");
    if (section === "workExperience")
      setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === "projects") setProjects(updatedSection as ProjectType[]);
  };

  const removeField = (index: number, section: string) => {
    if (section === "education")
      setEducation(education.filter((_, i) => i !== index));
    if (section === "workExperience")
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    if (section === "projects")
      setProjects(projects.filter((_, i) => i !== index));
  };

  const removeDetail = (
    index: number,
    detailIndex: number,
    section: string
  ) => {
    const updatedSection: (WorkExperienceType | ProjectType)[] = [
      ...(section === "workExperience" ? workExperience : projects),
    ];
    updatedSection[index].details = updatedSection[index].details.filter(
      (_, i) => i !== detailIndex
    );
    if (section === "workExperience")
      setWorkExperience(updatedSection as WorkExperienceType[]);
    if (section === "projects") setProjects(updatedSection as ProjectType[]);
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Format dates for education and work experience
      const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        if (dateStr === "Present") return "Present";
        try {
          const date = parseISO(dateStr);
          return format(date, "MMM yyyy");
        } catch {
          return dateStr;
        }
      };

      const formattedEducation = education.map((edu) => ({
        ...edu,
        dates: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
      }));
      const formattedWorkExperience = workExperience.map((work) => ({
        ...work,
        dates: `${formatDate(work.startDate)} - ${formatDate(work.endDate)}`,
      }));

      // Request for PDF
      const pdfResponse = await axios.post(
        `${BASE_URL}/api/generate-resume`,
        {
          personalInfo,
          education: formattedEducation.map((edu) => ({
            ...edu,
            showCoursework: edu.showCoursework,
          })),
          workExperience: formattedWorkExperience,
          projects,
          skills,
          showIcons,
        },
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(
        new Blob([pdfResponse.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Also update the LaTeX source for the "Download LaTeX" button
      const latexResponse = await axios.post(
        `${BASE_URL}/api/generate-resume`,
        {
          personalInfo,
          education: formattedEducation.map((edu) => ({
            ...edu,
            showCoursework: edu.showCoursework,
          })),
          workExperience: formattedWorkExperience,
          projects,
          skills,
          showIcons,
          format: "latex",
        }
      );
      setLatexSource(latexResponse.data.latex);
    } catch (err) {
      setError("Failed to generate resume.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLatex = () => {
    if (!latexSource) return;

    const blob = new Blob([latexSource], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setIsSlideoutOpen(false);
    }
  };

  React.useEffect(() => {
    if (isSlideoutOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSlideoutOpen]);

  const handleSaveResume = (savedResume: SavedResumeType) => {
    setCurrentResume(savedResume);
    setLastSaved(new Date());
    setIsDirty(false);
    console.log("Resume saved:", savedResume);
  };

  const handleLoadResume = async (resume: SavedResumeType) => {
    setCurrentResume(resume);
    setPersonalInfo(resume.personal_info);
    setEducation(resume.education);
    setWorkExperience(resume.work_experience);
    setProjects(resume.projects);
    setSkills(resume.skills);
    setShowIcons(resume.show_icons);
    setIsDirty(false);

    // Automatically generate the resume
    setIsLoading(true);
    setError("");

    try {
      // Format dates for education and work experience
      const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        if (dateStr === "Present") return "Present";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      };

      const formattedEducation = resume.education.map((edu) => ({
        ...edu,
        dates: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
      }));
      const formattedWorkExperience = resume.work_experience.map((work) => ({
        ...work,
        dates: `${formatDate(work.startDate)} - ${formatDate(work.endDate)}`,
      }));

      // Request for PDF
      const pdfResponse = await axios.post(
        `${BASE_URL}/api/generate-resume`,
        {
          personalInfo: resume.personal_info,
          education: formattedEducation.map((edu) => ({
            ...edu,
            showCoursework: edu.showCoursework,
          })),
          workExperience: formattedWorkExperience,
          projects: resume.projects,
          skills: resume.skills,
          showIcons: resume.show_icons,
        },
        { responseType: "blob" }
      );

      // Request for LaTeX source
      const latexResponse = await axios.post(
        `${BASE_URL}/api/generate-resume`,
        {
          personalInfo: resume.personal_info,
          education: formattedEducation.map((edu) => ({
            ...edu,
            showCoursework: edu.showCoursework,
          })),
          workExperience: formattedWorkExperience,
          projects: resume.projects,
          skills: resume.skills,
          showIcons: resume.show_icons,
          format: "latex",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([pdfResponse.data], { type: "application/pdf" })
      );
      setResumeUrl(url);
      setLatexSource(latexResponse.data.latex);
    } catch (err) {
      setError("Failed to generate resume.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate section completion
  const calculateProgress = useCallback(
    (section: string) => {
      switch (section) {
        case "personalInfo": {
          // Only include fields that have visibility buttons if they are visible
          const fields = [
            personalInfo.name, // Always required
            showIcons.email ? personalInfo.email : null,
            showIcons.github ? personalInfo.github : null,
            showIcons.website ? personalInfo.website : null,
            showIcons.linkedin ? personalInfo.linkedin : null,
            showIcons.phone ? personalInfo.phone : null,
          ].filter((field) => field !== null);

          const filledFields = fields.filter(
            (field) => field && field.length > 0
          ).length;
          const totalFields = fields.length;

          return {
            completed: (filledFields / totalFields) * 100,
            total: 100,
          };
        }

        case "education": {
          if (education.length === 0) return { completed: 0, total: 1 };
          const eduCompleted = education.reduce((acc, edu) => {
            const fields = [
              edu.school,
              edu.degree,
              edu.location,
              edu.startDate,
              edu.endDate,
            ];
            const filledFields = fields.filter(
              (field) => field && field.length > 0
            ).length;
            return acc + (filledFields / fields.length) * 100;
          }, 0);
          return {
            completed: eduCompleted / education.length,
            total: 100,
          };
        }

        case "workExperience": {
          if (workExperience.length === 0) return { completed: 0, total: 1 };
          const workCompleted = workExperience.reduce((acc, work) => {
            const fields = [
              work.company,
              work.position,
              work.location,
              work.startDate,
              work.endDate,
              ...(work.details || []),
            ];
            const filledFields = fields.filter(
              (field) => field && field.length > 0
            ).length;
            return acc + (filledFields / Math.max(fields.length, 1)) * 100;
          }, 0);
          return {
            completed: workCompleted / workExperience.length,
            total: 100,
          };
        }

        case "projects": {
          if (projects.length === 0) return { completed: 0, total: 1 };
          const projCompleted = projects.reduce((acc, proj) => {
            const fields = [
              proj.name,
              proj.technologies,
              proj.liveUrl,
              proj.githubUrl,
              proj.details.some((d) => d && d.length > 0) ? "filled" : "",
              ...(proj.showDate ? [proj.startDate, proj.endDate] : []),
            ];
            const filledFields = fields.filter(
              (field) => field && field.length > 0
            ).length;
            const totalFields = fields.length;
            return acc + (filledFields / totalFields) * 100;
          }, 0);
          return {
            completed: projCompleted / projects.length,
            total: 100,
          };
        }

        case "skills": {
          const fields = [skills.languages, skills.frameworks, skills.tools];
          const filledFields = fields.filter(
            (field) => field && field.length > 0
          ).length;
          return {
            completed: (filledFields / fields.length) * 100,
            total: 100,
          };
        }

        default:
          return { completed: 0, total: 1 };
      }
    },
    [personalInfo, education, workExperience, projects, skills, showIcons]
  );

  // Add useEffect to load most recent resume
  React.useEffect(() => {
    const loadMostRecentResume = async () => {
      if (!user) return;

      try {
        const { data: resumes, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (error) throw error;

        if (resumes && resumes.length > 0) {
          const mostRecent = resumes[0];
          handleLoadResume(mostRecent);
        }
      } catch (err) {
        console.error("Error loading most recent resume:", err);
      }
    };

    loadMostRecentResume();
  }, [user]);

  const handleEducationReorder = (newOrder: EducationType[]) => {
    setEducation(newOrder);
    setIsDirty(true);
  };

  const handleWorkExperienceReorder = (newOrder: WorkExperienceType[]) => {
    setWorkExperience(newOrder);
    setIsDirty(true);
  };

  const handleProjectsReorder = (newOrder: ProjectType[]) => {
    setProjects(newOrder);
    setIsDirty(true);
  };

  const handlePersonalInfoChange = (
    field: keyof PersonalInfoType,
    value: string
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationType,
    value: string | boolean
  ) => {
    setEducation((prev) => {
      const newEducation = [...prev];
      if (field === "showCoursework") {
        newEducation[index] = {
          ...newEducation[index],
          [field]: value as boolean,
        };
      } else {
        newEducation[index] = {
          ...newEducation[index],
          [field]: value as string,
        };
      }
      return newEducation;
    });
  };

  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperienceType,
    value: string | string[]
  ) => {
    setWorkExperience((prev) => {
      const newWorkExperience = [...prev];
      newWorkExperience[index] = {
        ...newWorkExperience[index],
        [field]: value,
      };
      return newWorkExperience;
    });
  };

  const handleProjectChange = (
    index: number,
    field: keyof ProjectType,
    value: string | string[]
  ) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return newProjects;
    });
  };

  const handleSkillsChange = (field: keyof SkillsType, value: string) => {
    setSkills((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleIcon = (field: keyof ShowIconsType) => {
    setShowIcons((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRemoveEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleRemoveWorkExperience = (index: number) => {
    setWorkExperience((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleRemoveProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleAddEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        school: "",
        degree: "",
        program: "",
        location: "",
        coursework: "",
        startDate: "",
        endDate: "",
        showCoursework: false,
      },
    ]);
    setIsDirty(true);
  };

  const handleAddWorkExperience = () => {
    setWorkExperience((prev) => [
      ...prev,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        details: [""],
      },
    ]);
    setIsDirty(true);
  };

  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        name: "",
        technologies: "",
        liveUrl: "",
        githubUrl: "",
        details: [""],
        startDate: "",
        endDate: "",
        showDate: true,
      },
    ]);
    setIsDirty(true);
  };

  const handleAddWorkDetail = (index: number) => {
    setWorkExperience((prev) => {
      const newWorkExperience = [...prev];
      newWorkExperience[index] = {
        ...newWorkExperience[index],
        details: [...newWorkExperience[index].details, ""],
      };
      return newWorkExperience;
    });
    setIsDirty(true);
  };

  const handleAddProjectDetail = (index: number) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[index] = {
        ...newProjects[index],
        details: [...newProjects[index].details, ""],
      };
      return newProjects;
    });
    setIsDirty(true);
  };

  const handleRemoveWorkDetail = (workIndex: number, detailIndex: number) => {
    setWorkExperience((prev) => {
      const newWorkExperience = [...prev];
      newWorkExperience[workIndex] = {
        ...newWorkExperience[workIndex],
        details: newWorkExperience[workIndex].details.filter(
          (_, i) => i !== detailIndex
        ),
      };
      return newWorkExperience;
    });
    setIsDirty(true);
  };

  const handleRemoveProjectDetail = (
    projectIndex: number,
    detailIndex: number
  ) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[projectIndex] = {
        ...newProjects[projectIndex],
        details: newProjects[projectIndex].details.filter(
          (_, i) => i !== detailIndex
        ),
      };
      return newProjects;
    });
    setIsDirty(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {user && (
              <>
                <SaveResumeDialog
                  onSave={handleSaveResume}
                  resumeData={{
                    name: currentResume?.name || "",
                    personal_info: personalInfo,
                    education,
                    work_experience: workExperience,
                    projects,
                    skills,
                    show_icons: showIcons,
                  }}
                  currentResume={currentResume}
                />
                <SavedResumesDialog onLoad={handleLoadResume} />
              </>
            )}

            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadLatex}
              disabled={!latexSource}
            >
              <FileCode className="mr-2 h-4 w-4" />
              Download LaTeX
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon" className="h-9 w-9">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preview Notice</DialogTitle>
                  <DialogDescription>
                    This preview is a close representation of your resume, but
                    the final PDF may have slight variations in spacing,
                    alignment, and formatting.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <EditableResumePreview
          personalInfo={personalInfo}
          education={education}
          workExperience={workExperience}
          projects={projects}
          skills={skills}
          showIcons={showIcons}
          onPersonalInfoChange={handlePersonalInfoChange}
          onEducationChange={handleEducationChange}
          onWorkExperienceChange={handleWorkExperienceChange}
          onProjectChange={handleProjectChange}
          onSkillsChange={handleSkillsChange}
          onToggleIcon={handleToggleIcon}
          onRemoveEducation={handleRemoveEducation}
          onRemoveWorkExperience={handleRemoveWorkExperience}
          onRemoveProject={handleRemoveProject}
          onAddEducation={handleAddEducation}
          onAddWorkExperience={handleAddWorkExperience}
          onAddProject={handleAddProject}
          onAddWorkDetail={handleAddWorkDetail}
          onAddProjectDetail={handleAddProjectDetail}
          onRemoveWorkDetail={handleRemoveWorkDetail}
          onRemoveProjectDetail={handleRemoveProjectDetail}
        />
      </div>
    </main>
  );
};

export default Home;
