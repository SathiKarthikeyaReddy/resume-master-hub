import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

const heading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24 })],
    border: { bottom: { color: "999999", size: 6, space: 1, style: "single" } },
  });

const para = (text: string, opts: { bold?: boolean; size?: number; italics?: boolean } = {}) =>
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 22, italics: opts.italics })],
  });

const bullet = (text: string) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22 })],
  });

export const exportResumeDocx = async (data: ResumeData) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects, languages, volunteer, awards, references, customSections, sectionOrder } = data;
  const order = sectionOrder || ["personalInfo", "summary", "experience", "education", "skills", "certifications", "projects", "languages", "volunteer", "awards", "references"];

  const children: Paragraph[] = [];

  // Header (always first regardless of order)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: personalInfo.fullName || "Your Name", bold: true, size: 40 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.website]
            .filter(Boolean).join("  •  "),
          size: 20,
        }),
      ],
    }),
  );

  for (const key of order) {
    if (key === "personalInfo") continue;

    if (key === "summary" && summary) {
      children.push(heading("Professional Summary"), para(summary));
    } else if (key === "experience" && experience.length) {
      children.push(heading("Work Experience"));
      for (const exp of experience) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: `${exp.jobTitle}`, bold: true, size: 24 }),
              new TextRun({ text: `\t${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`, size: 20 }),
            ],
          }),
          para(`${exp.company}${exp.location ? `, ${exp.location}` : ""}`, { italics: true, size: 20 }),
        );
        for (const b of exp.bullets.filter((x) => x.trim())) children.push(bullet(b));
      }
    } else if (key === "education" && education.length) {
      children.push(heading("Education"));
      for (const edu of education) {
        children.push(
          para(`${edu.degree} — ${edu.institution}`, { bold: true }),
          para(`${edu.graduationDate}${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}`, { size: 20 }),
        );
      }
    } else if (key === "skills" && skills.length) {
      children.push(heading("Skills"), para(skills.join(" • ")));
    } else if (key === "certifications" && certifications?.length) {
      children.push(heading("Certifications"));
      for (const c of certifications) children.push(para(`${c.name} — ${c.issuer} (${c.date})`));
    } else if (key === "projects" && projects?.length) {
      children.push(heading("Projects"));
      for (const p of projects) {
        children.push(para(p.name, { bold: true }), para(p.description));
        if (p.technologies?.length) children.push(para(p.technologies.join(", "), { italics: true, size: 20 }));
      }
    } else if (key === "languages" && languages?.length) {
      children.push(heading("Languages"), para(languages.map((l) => `${l.name} (${l.proficiency})`).join(" • ")));
    } else if (key === "volunteer" && volunteer?.length) {
      children.push(heading("Volunteer Experience"));
      for (const v of volunteer) {
        children.push(
          para(`${v.role} — ${v.organization}`, { bold: true }),
          para(`${v.startDate} – ${v.current ? "Present" : v.endDate}`, { size: 20 }),
        );
        if (v.description) children.push(para(v.description));
      }
    } else if (key === "awards" && awards?.length) {
      children.push(heading("Awards & Honors"));
      for (const a of awards) children.push(para(`${a.title} — ${a.issuer} (${a.date})`, { bold: true }));
    } else if (key === "references" && references?.length) {
      children.push(heading("References"));
      for (const r of references) {
        children.push(
          para(`${r.name} — ${r.title}${r.company ? ` at ${r.company}` : ""}`, { bold: true }),
          para([r.email, r.phone].filter(Boolean).join(" • "), { size: 20 }),
        );
      }
    }
  }

  if (customSections?.length) {
    for (const section of customSections) {
      children.push(heading(section.title));
      for (const item of section.items) {
        if (item.heading) children.push(para(item.heading, { bold: true }));
        if (item.subheading) children.push(para(item.subheading, { italics: true, size: 20 }));
        if (item.description) children.push(para(item.description));
      }
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          }],
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName || "resume"}.docx`);
};
