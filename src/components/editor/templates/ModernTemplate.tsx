import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const hasPersonalInfo =
    personalInfo.fullName ||
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location;

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Helvetica',_'Arial',_sans-serif] text-sm">
      {/* Header with accent */}
      <header className="bg-slate-800 text-white p-8 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-300 text-xs">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              About Me
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-2 border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{exp.jobTitle}</h3>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-xs text-slate-500 mt-0.5">{exp.location}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-700 space-y-1">
                    {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="flex">
                        <span className="text-slate-400 mr-2">→</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Two Column Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-sm text-slate-800">{edu.degree}</h3>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  <p className="text-xs text-slate-500">
                    {edu.graduationDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!hasPersonalInfo &&
        !summary &&
        experience.length === 0 &&
        education.length === 0 &&
        skills.length === 0 && (
          <div className="text-center text-gray-400 py-20 px-8">
            <p className="text-lg mb-2">Your resume preview will appear here</p>
            <p className="text-sm">
              Start filling out the form on the left to see your resume take
              shape
            </p>
          </div>
        )}
    </div>
  );
};

export default ModernTemplate;
