import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface ExecutiveTemplateProps {
  data: ResumeData;
}

const ExecutiveTemplate = ({ data }: ExecutiveTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const hasPersonalInfo =
    personalInfo.fullName ||
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location;

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Playfair_Display',_Georgia,_serif] text-sm">
      {/* Executive Header - Navy with gold accent */}
      <header className="bg-slate-900 text-white p-10 relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
        <h1 className="text-4xl font-bold tracking-wide text-center mb-4">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-slate-300 text-xs">
          {personalInfo.email && (
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-amber-400" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      <div className="p-10">
        {/* Executive Summary */}
        {summary && (
          <section className="mb-8 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-amber-400" />
              Executive Summary
              <span className="w-12 h-px bg-amber-400" />
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Inter',_sans-serif] text-sm max-w-2xl mx-auto italic">
              "{summary}"
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-amber-400" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-amber-400 pl-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{exp.jobTitle}</h3>
                      <p className="text-amber-600 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-['Inter',_sans-serif]">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-xs text-slate-500 mb-2 font-['Inter',_sans-serif]">{exp.location}</p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-2 font-['Inter',_sans-serif]">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-amber-400 font-bold">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-amber-400" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-amber-400 pl-4">
                    <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                    <p className="text-amber-600 text-sm">{edu.institution}</p>
                    <p className="text-xs text-slate-500 font-['Inter',_sans-serif]">
                      {edu.graduationDate}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Competencies */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-amber-400" />
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-slate-700 font-['Inter',_sans-serif]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {skill}
                  </div>
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

export default ExecutiveTemplate;
