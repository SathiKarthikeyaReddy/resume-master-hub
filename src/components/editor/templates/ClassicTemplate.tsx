import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData, TemplateCustomization } from "@/types/resume";
import { CertificationsBlock, ProjectsBlock, LanguagesBlock, VolunteerBlock, AwardsBlock, ReferencesBlock, CustomSectionsBlock } from "./TemplateSections";

interface ClassicTemplateProps {
  data: ResumeData;
  customization?: TemplateCustomization;
}

const fontMap = {
  serif: "'Georgia', serif",
  "sans-serif": "'Inter', system-ui, sans-serif",
  mono: "'Courier New', monospace",
};

const fontSizeMap = {
  small: { body: "11px", heading: "13px", name: "22px" },
  medium: { body: "12px", heading: "14px", name: "24px" },
  large: { body: "13px", heading: "15px", name: "26px" },
};

const lineHeightMap = {
  compact: "1.3",
  normal: "1.5",
  relaxed: "1.7",
};

const ClassicTemplate = ({ data, customization }: ClassicTemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const c = customization || { primaryColor: "#0f766e", fontFamily: "serif" as const, fontSize: "medium" as const, lineSpacing: "normal" as const, showPhoto: false };

  const hasPersonalInfo = personalInfo.fullName || personalInfo.email || personalInfo.phone || personalInfo.location;
  const hasAnyContent = hasPersonalInfo || summary || experience.length > 0 || education.length > 0 || skills.length > 0 ||
    (data.certifications?.length > 0) || (data.projects?.length > 0) || (data.languages?.length > 0) || (data.volunteer?.length > 0) || (data.awards?.length > 0);

  const style = {
    fontFamily: fontMap[c.fontFamily],
    fontSize: fontSizeMap[c.fontSize].body,
    lineHeight: lineHeightMap[c.lineSpacing],
  };

  return (
    <div className="bg-white text-gray-900 p-8 min-h-[1123px] w-full max-w-[794px] mx-auto shadow-lg" style={style}>
      <header className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${c.primaryColor}20` }}>
        <div className="flex items-center justify-center gap-4">
          {c.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: c.primaryColor }} />
          )}
          <div>
            <h1 className="font-bold uppercase tracking-wider mb-2" style={{ fontSize: fontSizeMap[c.fontSize].name, color: c.primaryColor }}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-gray-600" style={{ fontSize: "11px" }}>
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
              {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </header>

      {summary && (
        <section className="mb-5">
          <h2 className="font-bold uppercase tracking-wider pb-1 mb-2" style={{ fontSize: fontSizeMap[c.fontSize].heading, borderBottom: `1px solid ${c.primaryColor}30`, color: c.primaryColor }}>Professional Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase tracking-wider pb-1 mb-2" style={{ fontSize: fontSizeMap[c.fontSize].heading, borderBottom: `1px solid ${c.primaryColor}30`, color: c.primaryColor }}>Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold" style={{ fontSize: fontSizeMap[c.fontSize].heading }}>{exp.jobTitle}</h3>
                <span className="text-gray-500" style={{ fontSize: "11px" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <div className="text-gray-600 mb-1" style={{ fontSize: "11px" }}>{exp.company}{exp.location && `, ${exp.location}`}</div>
              {exp.bullets?.length > 0 && (
                <ul className="text-gray-700 list-disc list-inside space-y-0.5">
                  {exp.bullets.filter(b => b.trim()).map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase tracking-wider pb-1 mb-2" style={{ fontSize: fontSizeMap[c.fontSize].heading, borderBottom: `1px solid ${c.primaryColor}30`, color: c.primaryColor }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold" style={{ fontSize: fontSizeMap[c.fontSize].heading }}>{edu.degree}</h3>
                <span className="text-gray-500" style={{ fontSize: "11px" }}>{edu.graduationDate}</span>
              </div>
              <div className="text-gray-600" style={{ fontSize: "11px" }}>{edu.institution}{edu.location && `, ${edu.location}`}{edu.gpa && ` • GPA: ${edu.gpa}`}</div>
              {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase tracking-wider pb-1 mb-2" style={{ fontSize: fontSizeMap[c.fontSize].heading, borderBottom: `1px solid ${c.primaryColor}30`, color: c.primaryColor }}>Skills</h2>
          <p className="text-gray-700">{skills.join(" • ")}</p>
        </section>
      )}

      <CertificationsBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <ProjectsBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <LanguagesBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <VolunteerBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <AwardsBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <ReferencesBlock data={data} variant="classic" primaryColor={c.primaryColor} />
      <CustomSectionsBlock data={data} variant="classic" primaryColor={c.primaryColor} />

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
