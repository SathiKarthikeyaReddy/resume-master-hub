import { ResumeData } from "@/types/resume";

/** Shared rendering helpers for extra resume sections across all templates */

interface SectionProps {
  data: ResumeData;
  variant?: "classic" | "modern" | "minimal" | "creative" | "executive";
}

const proficiencyLabel: Record<string, string> = {
  native: "Native",
  fluent: "Fluent",
  advanced: "Advanced",
  intermediate: "Intermediate",
  beginner: "Beginner",
};

export const CertificationsBlock = ({ data, variant = "classic" }: SectionProps) => {
  if (!data.certifications?.length) return null;
  const titleClass = variant === "classic"
    ? "text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2"
    : variant === "modern"
    ? "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3"
    : variant === "minimal"
    ? "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4"
    : variant === "executive"
    ? "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4"
    : "text-lg font-bold text-gray-800";

  return (
    <section className="mb-5">
      <h2 className={titleClass}>
        {variant === "executive" && <span className="w-8 h-px bg-amber-400" />}
        Certifications
      </h2>
      {data.certifications.map((cert) => (
        <div key={cert.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-sm">{cert.name}</h3>
            <span className="text-xs text-gray-500">{cert.date}{cert.expiryDate ? ` – ${cert.expiryDate}` : ""}</span>
          </div>
          <div className="text-xs text-gray-600">
            {cert.issuer}
            {cert.credentialId && ` • ID: ${cert.credentialId}`}
          </div>
        </div>
      ))}
    </section>
  );
};

export const ProjectsBlock = ({ data, variant = "classic" }: SectionProps) => {
  if (!data.projects?.length) return null;
  const titleClass = variant === "classic"
    ? "text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2"
    : variant === "modern"
    ? "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3"
    : variant === "minimal"
    ? "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4"
    : variant === "executive"
    ? "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4"
    : "text-lg font-bold text-gray-800";

  return (
    <section className="mb-5">
      <h2 className={titleClass}>
        {variant === "executive" && <span className="w-8 h-px bg-amber-400" />}
        Projects
      </h2>
      {data.projects.map((proj) => (
        <div key={proj.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-sm">{proj.name}</h3>
            {(proj.startDate || proj.endDate) && (
              <span className="text-xs text-gray-500">
                {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>
          {proj.technologies.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Tech: {proj.technologies.join(", ")}
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

export const LanguagesBlock = ({ data, variant = "classic" }: SectionProps) => {
  if (!data.languages?.length) return null;
  const titleClass = variant === "classic"
    ? "text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2"
    : variant === "modern"
    ? "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3"
    : variant === "minimal"
    ? "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3"
    : variant === "executive"
    ? "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4"
    : "text-lg font-bold text-gray-800";

  return (
    <section className="mb-5">
      <h2 className={titleClass}>
        {variant === "executive" && <span className="w-8 h-px bg-amber-400" />}
        Languages
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
        {data.languages.map((lang) => (
          <span key={lang.id}>
            {lang.name} — {proficiencyLabel[lang.proficiency] || lang.proficiency}
          </span>
        ))}
      </div>
    </section>
  );
};

export const VolunteerBlock = ({ data, variant = "classic" }: SectionProps) => {
  if (!data.volunteer?.length) return null;
  const titleClass = variant === "classic"
    ? "text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2"
    : variant === "modern"
    ? "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3"
    : variant === "minimal"
    ? "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4"
    : variant === "executive"
    ? "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4"
    : "text-lg font-bold text-gray-800";

  return (
    <section className="mb-5">
      <h2 className={titleClass}>
        {variant === "executive" && <span className="w-8 h-px bg-amber-400" />}
        Volunteer Experience
      </h2>
      {data.volunteer.map((vol) => (
        <div key={vol.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-sm">{vol.role}</h3>
            <span className="text-xs text-gray-500">
              {vol.startDate} – {vol.current ? "Present" : vol.endDate}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {vol.organization}{vol.location && `, ${vol.location}`}
          </div>
          {vol.description && (
            <p className="text-xs text-gray-700 mt-1">{vol.description}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export const AwardsBlock = ({ data, variant = "classic" }: SectionProps) => {
  if (!data.awards?.length) return null;
  const titleClass = variant === "classic"
    ? "text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2"
    : variant === "modern"
    ? "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3"
    : variant === "minimal"
    ? "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3"
    : variant === "executive"
    ? "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4"
    : "text-lg font-bold text-gray-800";

  return (
    <section className="mb-5">
      <h2 className={titleClass}>
        {variant === "executive" && <span className="w-8 h-px bg-amber-400" />}
        Awards & Honors
      </h2>
      {data.awards.map((award) => (
        <div key={award.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-sm">{award.title}</h3>
            <span className="text-xs text-gray-500">{award.date}</span>
          </div>
          <div className="text-xs text-gray-600">{award.issuer}</div>
          {award.description && (
            <p className="text-xs text-gray-700 mt-0.5">{award.description}</p>
          )}
        </div>
      ))}
    </section>
  );
};
