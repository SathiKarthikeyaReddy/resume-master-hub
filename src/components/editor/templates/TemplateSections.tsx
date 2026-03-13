import { ResumeData } from "@/types/resume";

interface BlockProps {
  data: ResumeData;
  variant: "classic" | "modern" | "minimal" | "creative" | "executive";
  primaryColor?: string;
}

const sectionHeadingStyle = (variant: string, primaryColor?: string) => {
  const color = primaryColor || "#374151";
  if (variant === "classic") return { className: "font-bold uppercase tracking-wider pb-1 mb-2 text-sm", style: { borderBottom: `1px solid ${color}30`, color } };
  if (variant === "modern") return { className: "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3", style: {} };
  if (variant === "creative") return { className: "text-lg font-bold text-gray-800 mb-3", style: {} };
  if (variant === "executive") return { className: "text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-4", style: {} };
  return { className: "text-xs font-semibold uppercase tracking-[0.2em] mb-3", style: { color } };
};

export const CertificationsBlock = ({ data, variant, primaryColor }: BlockProps) => {
  if (!data.certifications?.length) return null;
  const h = sectionHeadingStyle(variant, primaryColor);
  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>Certifications</h2>
      {data.certifications.map((cert) => (
        <div key={cert.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-sm">{cert.name}</span>
            <span className="text-xs text-gray-500">{cert.date}</span>
          </div>
          <div className="text-xs text-gray-600">{cert.issuer}{cert.credentialId && ` • ID: ${cert.credentialId}`}</div>
        </div>
      ))}
    </section>
  );
};

export const ProjectsBlock = ({ data, variant, primaryColor }: BlockProps) => {
  if (!data.projects?.length) return null;
  const h = sectionHeadingStyle(variant, primaryColor);
  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>Projects</h2>
      {data.projects.map((project) => (
        <div key={project.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-sm">{project.name}</span>
            {project.startDate && <span className="text-xs text-gray-500">{project.startDate}{project.endDate && ` – ${project.endDate}`}</span>}
          </div>
          <p className="text-xs text-gray-700">{project.description}</p>
          {project.technologies.length > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{project.technologies.join(", ")}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export const LanguagesBlock = ({ data, variant, primaryColor }: BlockProps) => {
  if (!data.languages?.length) return null;
  const h = sectionHeadingStyle(variant, primaryColor);
  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>Languages</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
        {data.languages.map((lang) => (
          <span key={lang.id}>{lang.name} — <span className="capitalize text-gray-500">{lang.proficiency}</span></span>
        ))}
      </div>
    </section>
  );
};

export const VolunteerBlock = ({ data, variant, primaryColor }: BlockProps) => {
  if (!data.volunteer?.length) return null;
  const h = sectionHeadingStyle(variant, primaryColor);
  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>Volunteer Experience</h2>
      {data.volunteer.map((vol) => (
        <div key={vol.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-sm">{vol.role}</span>
            <span className="text-xs text-gray-500">{vol.startDate} – {vol.current ? "Present" : vol.endDate}</span>
          </div>
          <div className="text-xs text-gray-600">{vol.organization}{vol.location && `, ${vol.location}`}</div>
          {vol.description && <p className="text-xs text-gray-700 mt-0.5">{vol.description}</p>}
        </div>
      ))}
    </section>
  );
};

export const AwardsBlock = ({ data, variant, primaryColor }: BlockProps) => {
  if (!data.awards?.length) return null;
  const h = sectionHeadingStyle(variant, primaryColor);
  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>Awards & Honors</h2>
      {data.awards.map((award) => (
        <div key={award.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-sm">{award.title}</span>
            <span className="text-xs text-gray-500">{award.date}</span>
          </div>
          <div className="text-xs text-gray-600">{award.issuer}</div>
          {award.description && <p className="text-xs text-gray-700 mt-0.5">{award.description}</p>}
        </div>
      ))}
    </section>
  );
};

export const ReferencesBlock = ({ data, variant, primaryColor }: BlockProps) => {
  const refs = data.references || [];
  const h = sectionHeadingStyle(variant, primaryColor);

  if (refs.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className={h.className} style={h.style}>References</h2>
      <div className="grid grid-cols-2 gap-3">
        {refs.map((ref) => (
          <div key={ref.id} className="text-xs">
            <div className="font-semibold text-sm">{ref.name}</div>
            <div className="text-gray-600">{ref.title}{ref.company && ` at ${ref.company}`}</div>
            {ref.relationship && <div className="text-gray-500 italic">{ref.relationship}</div>}
            {ref.email && <div className="text-gray-600">{ref.email}</div>}
            {ref.phone && <div className="text-gray-600">{ref.phone}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export const CustomSectionsBlock = ({ data, variant, primaryColor }: BlockProps) => {
  const sections = data.customSections || [];
  if (sections.length === 0) return null;
  const h = sectionHeadingStyle(variant, primaryColor);

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="mb-5">
          <h2 className={h.className} style={h.style}>{section.title}</h2>
          {section.items.map((item) => (
            <div key={item.id} className="mb-2">
              {item.heading && <div className="font-semibold text-sm">{item.heading}</div>}
              {item.subheading && <div className="text-xs text-gray-600">{item.subheading}</div>}
              {item.description && <p className="text-xs text-gray-700 mt-0.5">{item.description}</p>}
            </div>
          ))}
        </section>
      ))}
    </>
  );
};
