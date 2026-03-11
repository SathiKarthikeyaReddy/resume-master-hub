export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "beginner";
}

export interface VolunteerExperience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export type ResumeSectionKey =
  | "personalInfo"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "languages"
  | "volunteer"
  | "awards";

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  volunteer: VolunteerExperience[];
  awards: Award[];
  sectionOrder: ResumeSectionKey[];
}

export const defaultSectionOrder: ResumeSectionKey[] = [
  "personalInfo",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "projects",
  "languages",
  "volunteer",
  "awards",
];

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  volunteer: [],
  awards: [],
  sectionOrder: defaultSectionOrder,
};
