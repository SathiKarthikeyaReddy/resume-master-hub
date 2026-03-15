import { useMemo } from "react";
import { ResumeData } from "@/types/resume";

interface StrengthResult {
  percentage: number;
  label: string;
  completedSections: string[];
  missingSections: string[];
}

export const useResumeStrength = (data: ResumeData): StrengthResult => {
  return useMemo(() => {
    const sections = [
      {
        name: "Personal Info",
        completed: Boolean(
          data.personalInfo.fullName &&
            data.personalInfo.email &&
            data.personalInfo.phone
        ),
      },
      {
        name: "Summary",
        completed: data.summary.length >= 50,
      },
      {
        name: "Experience",
        completed:
          data.experience.length > 0 &&
          data.experience.some((exp) => exp.bullets.some((b) => b.trim())),
      },
      {
        name: "Education",
        completed:
          data.education.length > 0 &&
          data.education.some((edu) => edu.degree && edu.institution),
      },
      {
        name: "Skills",
        completed: data.skills.length >= 3,
      },
      {
        name: "Location",
        completed: Boolean(data.personalInfo.location),
      },
      {
        name: "LinkedIn",
        completed: Boolean(data.personalInfo.linkedin),
      },
    ];

    // Bonus sections (optional but boost score)
    const bonusSections = [
      { name: "Certifications", completed: (data.certifications?.length || 0) > 0 },
      { name: "Projects", completed: (data.projects?.length || 0) > 0 },
      { name: "Languages", completed: (data.languages?.length || 0) > 0 },
    ];

    const allSections = [...sections, ...bonusSections];

    const completedSections = allSections
      .filter((s) => s.completed)
      .map((s) => s.name);
    const missingSections = allSections
      .filter((s) => !s.completed)
      .map((s) => s.name);

    const percentage = Math.round(
      (completedSections.length / allSections.length) * 100
    );

    let label = "Getting Started";
    if (percentage >= 100) label = "Excellent!";
    else if (percentage >= 80) label = "Strong";
    else if (percentage >= 60) label = "Good";
    else if (percentage >= 40) label = "Fair";
    else if (percentage >= 20) label = "Needs Work";

    return {
      percentage,
      label,
      completedSections,
      missingSections,
    };
  }, [data]);
};
