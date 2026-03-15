import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData, TemplateCustomization, ResumeSectionKey } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock, ReferencesBlock, CustomSectionsBlock } from "./TemplateSections";

interface CreativeTemplateProps { data: ResumeData; customization?: TemplateCustomization; }

const CreativeTemplate = ({ data, customization }: CreativeTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const accent = customization?.primaryColor || "#7c3aed";
  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  const iconBox = (emoji: string) => (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>{emoji}</div>
  );

  const renderSection = (key: ResumeSectionKey) => {
    switch (key) {
      case "personalInfo": return null;
      case "summary":
        if (!summary) return null;
        return (
          <section key="summary" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {iconBox("✦")}
              <h2 className="text-lg font-bold text-gray-800">About Me</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-[52px]">{summary}</p>
          </section>
        );
      case "experience":
        if (experience.length === 0) return null;
        return (
          <section key="experience" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {iconBox("💼")}
              <h2 className="text-lg font-bold text-gray-800">Experience</h2>
            </div>
            <div className="pl-[52px] space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-6 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp.jobTitle}</h3>
                      <p className="text-sm font-medium" style={{ color: accent }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="flex gap-2"><span style={{ color: accent }}>▸</span>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "education":
        if (education.length === 0) return null;
        return (
          <section key="education" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {iconBox("🎓")}
              <h2 className="text-lg font-bold text-gray-800">Education</h2>
            </div>
            <div className="pl-[52px] space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-sm text-gray-800">{edu.degree}</h3>
                  <p className="text-xs" style={{ color: accent }}>{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.graduationDate}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        if (skills.length === 0) return null;
        return (
          <section key="skills" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {iconBox("⚡")}
              <h2 className="text-lg font-bold text-gray-800">Skills</h2>
            </div>
            <div className="pl-[52px] flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: `${accent}15`, color: accent }}>{skill}</span>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return <CertificationsBlock key="certifications" data={data} variant="creative" primaryColor={accent} />;
      case "projects":
        return <ProjectsBlock key="projects" data={data} variant="creative" primaryColor={accent} />;
      case "languages":
        return <LanguagesBlock key="languages" data={data} variant="creative" primaryColor={accent} />;
      case "volunteer":
        return <VolunteerBlock key="volunteer" data={data} variant="creative" primaryColor={accent} />;
      case "awards":
        return <AwardsBlock key="awards" data={data} variant="creative" primaryColor={accent} />;
      case "references":
        return <ReferencesBlock key="references" data={data} variant="creative" primaryColor={accent} />;
      default: return null;
    }
  };

  const sectionOrder = data.sectionOrder || ["personalInfo", "summary", "experience", "education", "skills", "certifications", "projects", "languages", "volunteer", "awards", "references"];

  return (
    <div className="bg-white text-gray-900 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Poppins',_sans-serif] text-sm">
      <header className="text-white p-10 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
        <div className="relative z-10 flex items-center gap-4">
          {customization?.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover border-3 border-white/50" />
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{personalInfo.fullName || "Your Name"}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs mt-4">
              {personalInfo.email && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
              {personalInfo.website && <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full"><Globe className="w-3.5 h-3.5" />{personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </header>
      <div className="p-8">
        {sectionOrder.map((key) => renderSection(key))}
        <CustomSectionsBlock data={data} variant="creative" primaryColor={accent} />
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

export default CreativeTemplate;
