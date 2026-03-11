import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock } from "./TemplateSections";

interface CreativeTemplateProps { data: ResumeData; }

const CreativeTemplate = ({ data }: CreativeTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Poppins',_sans-serif] text-sm">
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{personalInfo.fullName || "Your Name"}</h1>
          <div className="flex flex-wrap items-center gap-4 text-violet-100 text-xs mt-4">
            {personalInfo.email && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
            {personalInfo.website && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Globe className="w-3.5 h-3.5" />{personalInfo.website}</span>}
          </div>
        </div>
      </header>
      <div className="p-8">
        {summary && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">✦</div>
              <h2 className="text-lg font-bold text-gray-800">About Me</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-[52px]">{summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">💼</div>
              <h2 className="text-lg font-bold text-gray-800">Experience</h2>
            </div>
            <div className="pl-[52px] space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-violet-400" />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp.jobTitle}</h3>
                      <p className="text-violet-600 text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="flex gap-2"><span className="text-violet-400">▸</span>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">🎓</div>
                <h2 className="text-lg font-bold text-gray-800">Education</h2>
              </div>
              <div className="pl-[52px] space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-sm text-gray-800">{edu.degree}</h3>
                    <p className="text-violet-600 text-xs">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">⚡</div>
                <h2 className="text-lg font-bold text-gray-800">Skills</h2>
              </div>
              <div className="pl-[52px] flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs rounded-full font-medium">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="mt-6">
          <CertificationsBlock data={data} variant="creative" />
          <ProjectsBlock data={data} variant="creative" />
          <LanguagesBlock data={data} variant="creative" />
          <VolunteerBlock data={data} variant="creative" />
          <AwardsBlock data={data} variant="creative" />
        </div>
      </div>
      {!hasAnyContent && (
        <div className="text-center text-gray-400 py-20 px-8">
          <p className="text-lg mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form on the left to see your resume take shape</p>
        </div>
      )}
    </div>
  );
};

export default CreativeTemplate;
