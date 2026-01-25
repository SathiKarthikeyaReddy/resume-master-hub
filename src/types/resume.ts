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
  description: string;
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

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

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
};
