import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData, TemplateCustomization } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock, ReferencesBlock, CustomSectionsBlock } from "./TemplateSections";

interface ExecutiveTemplateProps { data: ResumeData; customization?: TemplateCustomization; }

const ExecutiveTemplate = ({ data, customization }: ExecutiveTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const accent = customization?.primaryColor || "#d97706";
  const headerBg = "#0f172a";
  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Playfair_Display',_Georgia,_serif] text-sm">
      <header className="text-white p-10 relative" style={{ backgroundColor: headerBg }}>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${accent}, ${accent}80, ${accent})` }} />
        <div className="flex items-center justify-center gap-4">
          {customization?.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: accent }} />
          )}
          <h1 className="text-4xl font-bold tracking-wide text-center">{personalInfo.fullName || "Your Name"}</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-slate-300 text-xs mt-4">
          {personalInfo.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: accent }} />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: accent }} />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: accent }} />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-2"><Linkedin className="w-4 h-4" style={{ color: accent }} />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-2"><Globe className="w-4 h-4" style={{ color: accent }} />{personalInfo.website}</span>}
        </div>
      </header>
      <div className="p-10">
        {summary && (
          <section className="mb-8 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center justify-center gap-4">
              <span className="w-12 h-px" style={{ backgroundColor: accent }} />Executive Summary<span className="w-12 h-px" style={{ backgroundColor: accent }} />
            </h2>
            <p className="text-gray-700 leading-relaxed font-['Inter',_sans-serif] text-sm max-w-2xl mx-auto italic">"{summary}"</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
              <span className="w-8 h-px" style={{ backgroundColor: accent }} />Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="pl-6 border-l-2" style={{ borderColor: accent }}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{exp.jobTitle}</h3>
                      <p className="font-semibold" style={{ color: accent }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-['Inter',_sans-serif]">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  {exp.location && <p className="text-xs text-slate-500 mb-2 font-['Inter',_sans-serif]">{exp.location}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-2 font-['Inter',_sans-serif]">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="flex gap-3"><span className="font-bold" style={{ color: accent }}>•</span>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4">
                <span className="w-8 h-px" style={{ backgroundColor: accent }} />Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4 border-l-2" style={{ borderColor: accent }}>
                    <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                    <p className="text-sm" style={{ color: accent }}>{edu.institution}</p>
                    <p className="text-xs text-slate-500 font-['Inter',_sans-serif]">{edu.graduationDate}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4">
                <span className="w-8 h-px" style={{ backgroundColor: accent }} />Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 font-['Inter',_sans-serif]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />{skill}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="mt-8">
          <CertificationsBlock data={data} variant="executive" primaryColor={accent} />
          <ProjectsBlock data={data} variant="executive" primaryColor={accent} />
          <LanguagesBlock data={data} variant="executive" primaryColor={accent} />
          <VolunteerBlock data={data} variant="executive" primaryColor={accent} />
          <AwardsBlock data={data} variant="executive" primaryColor={accent} />
          <ReferencesBlock data={data} variant="executive" primaryColor={accent} />
          <CustomSectionsBlock data={data} variant="executive" primaryColor={accent} />
        </div>
      </div>
      {!hasAnyContent && (
        <div className="text-center text-gray-400 py-20 px-8">
          <p className="text-lg mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form on the left</p>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
