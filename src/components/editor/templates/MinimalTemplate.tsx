import { ResumeData, TemplateCustomization } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock, ReferencesBlock, CustomSectionsBlock } from "./TemplateSections";

interface MinimalTemplateProps { data: ResumeData; customization?: TemplateCustomization; }

const MinimalTemplate = ({ data, customization }: MinimalTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const color = customization?.primaryColor || "#6b7280";
  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  return (
    <div className="bg-white text-gray-900 p-10 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg font-['Inter',_sans-serif] text-sm leading-relaxed">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          {customization?.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${color}` }} />
          )}
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2" style={{ color }}>{personalInfo.fullName || "Your Name"}</h1>
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <><span className="text-gray-300">|</span><span>{personalInfo.phone}</span></>}
              {personalInfo.location && <><span className="text-gray-300">|</span><span>{personalInfo.location}</span></>}
              {personalInfo.linkedin && <><span className="text-gray-300">|</span><span>{personalInfo.linkedin}</span></>}
              {personalInfo.website && <><span className="text-gray-300">|</span><span>{personalInfo.website}</span></>}
            </div>
          </div>
        </div>
      </header>
      {summary && (
        <section className="mb-8">
          <p className="text-gray-600 text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: `${color}40` }}>{summary}</p>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color }}>{`Experience`}</h2>
          {experience.map((exp, index) => (
            <div key={exp.id} className={index > 0 ? "mt-5" : ""}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-sm">{exp.jobTitle}</h3>
                <span className="text-xs text-gray-400">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{exp.company}{exp.location && ` · ${exp.location}`}</p>
              {exp.bullets?.length > 0 && (
                <ul className="text-xs text-gray-600 space-y-1">
                  {exp.bullets.filter(b => b.trim()).map((bullet, idx) => <li key={idx}>• {bullet}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-sm">{edu.degree}</h3>
                <span className="text-xs text-gray-400">{edu.graduationDate}</span>
              </div>
              <p className="text-xs text-gray-500">{edu.institution}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color }}>Skills</h2>
          <p className="text-xs text-gray-600">{skills.join("  ·  ")}</p>
        </section>
      )}
      <CertificationsBlock data={data} variant="minimal" primaryColor={color} />
      <ProjectsBlock data={data} variant="minimal" primaryColor={color} />
      <LanguagesBlock data={data} variant="minimal" primaryColor={color} />
      <VolunteerBlock data={data} variant="minimal" primaryColor={color} />
      <AwardsBlock data={data} variant="minimal" primaryColor={color} />
      <ReferencesBlock data={data} variant="minimal" primaryColor={color} />
      <CustomSectionsBlock data={data} variant="minimal" primaryColor={color} />
      {!hasAnyContent && (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form on the left</p>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
