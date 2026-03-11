import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock } from "./TemplateSections";

interface ClassicTemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  return (
    <div className="bg-white text-gray-900 p-8 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Georgia',_serif] text-sm leading-relaxed">
      <header className="text-center mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="text-gray-700 text-xs leading-relaxed">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm">{exp.jobTitle}</h3>
                <span className="text-xs text-gray-500">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{exp.company}{exp.location && `, ${exp.location}`}</div>
              {exp.bullets?.length > 0 && (
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
                  {exp.bullets.filter(b => b.trim()).map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm">{edu.degree}</h3>
                <span className="text-xs text-gray-500">{edu.graduationDate}</span>
              </div>
              <div className="text-xs text-gray-600">{edu.institution}{edu.location && `, ${edu.location}`}{edu.gpa && ` • GPA: ${edu.gpa}`}</div>
              {edu.description && <p className="text-xs text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <p className="text-xs text-gray-700">{skills.join(" • ")}</p>
        </section>
      )}

      <CertificationsBlock data={data} variant="classic" />
      <ProjectsBlock data={data} variant="classic" />
      <LanguagesBlock data={data} variant="classic" />
      <VolunteerBlock data={data} variant="classic" />
      <AwardsBlock data={data} variant="classic" />

      {!hasAnyContent && (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form on the left to see your resume take shape</p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
