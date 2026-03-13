export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
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

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; heading: string; subheading: string; description: string }[];
}

export interface TemplateCustomization {
  primaryColor: string;
  fontFamily: "serif" | "sans-serif" | "mono";
  fontSize: "small" | "medium" | "large";
  lineSpacing: "compact" | "normal" | "relaxed";
  showPhoto: boolean;
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
  | "awards"
  | "references";

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
  references: Reference[];
  customSections: CustomSection[];
  sectionOrder: ResumeSectionKey[];
  templateCustomization?: TemplateCustomization;
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
  "references",
];

export const defaultTemplateCustomization: TemplateCustomization = {
  primaryColor: "#0f766e",
  fontFamily: "serif",
  fontSize: "medium",
  lineSpacing: "normal",
  showPhoto: false,
};

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    photoUrl: "",
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
  references: [],
  customSections: [],
  sectionOrder: defaultSectionOrder,
  templateCustomization: defaultTemplateCustomization,
};
