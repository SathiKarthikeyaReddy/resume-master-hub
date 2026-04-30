import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Printer, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, defaultResumeData, defaultSectionOrder, defaultTemplateCustomization } from "@/types/resume";
import ClassicTemplate from "@/components/editor/templates/ClassicTemplate";
import ModernTemplate from "@/components/editor/templates/ModernTemplate";
import MinimalTemplate from "@/components/editor/templates/MinimalTemplate";
import CreativeTemplate from "@/components/editor/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/editor/templates/ExecutiveTemplate";
import { TemplateType } from "@/components/editor/TemplateSelector";

const SharedResume = () => {
  const { slug } = useParams<{ slug: string }>();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<TemplateType>("classic");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resumeData?.personalInfo.fullName || "Resume",
    pageStyle: `@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
  });

  useEffect(() => {
    const load = async () => {
      if (!slug) { setError("Invalid link"); setIsLoading(false); return; }

      const { data: sharedRows, error: shareErr } = await supabase
        .from("shared_resumes")
        .select("resume_id, is_active, view_count")
        .eq("slug", slug)
        .eq("is_active", true);

      if (shareErr || !sharedRows || sharedRows.length === 0) {
        setError("This resume is not available or the link has expired.");
        setIsLoading(false);
        return;
      }

      const shared = sharedRows[0];

      // Fire-and-forget view increment
      supabase
        .from("shared_resumes")
        .update({ view_count: (shared.view_count || 0) + 1 })
        .eq("slug", slug)
        .then(() => {});

      const { data: resume, error: resumeErr } = await supabase
        .from("resumes")
        .select("content")
        .eq("id", shared.resume_id)
        .single();

      if (resumeErr || !resume) {
        setError("Resume not found.");
        setIsLoading(false);
        return;
      }

      const content = resume.content as unknown as ResumeData & { template?: TemplateType };
      setResumeData({
        ...defaultResumeData,
        ...content,
        personalInfo: { ...defaultResumeData.personalInfo, ...content.personalInfo },
        sectionOrder: content.sectionOrder || defaultSectionOrder,
        references: content.references || [],
        customSections: content.customSections || [],
        templateCustomization: content.templateCustomization || defaultTemplateCustomization,
      });
      if (content.template) setTemplate(content.template);
      setIsLoading(false);
    };

    load();
  }, [slug]);

  // SEO: dynamic title + meta
  useEffect(() => {
    if (!resumeData) return;
    const name = resumeData.personalInfo.fullName || "Professional Resume";
    document.title = `${name} — Resume`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", (resumeData.summary || `Professional resume for ${name}.`).slice(0, 155));
  }, [resumeData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading resume...</div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Resume Unavailable</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="hero">
            <Link to="/">Build your own resume</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customization = resumeData.templateCustomization || defaultTemplateCustomization;

  const renderTemplate = () => {
    const props = { data: resumeData, customization };
    switch (template) {
      case "modern": return <ModernTemplate {...props} />;
      case "minimal": return <MinimalTemplate {...props} />;
      case "creative": return <CreativeTemplate {...props} />;
      case "executive": return <ExecutiveTemplate {...props} />;
      case "classic": default: return <ClassicTemplate {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-[850px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            <FileText className="w-4 h-4 text-primary" />
            Build your resume free
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Save as PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div ref={printRef} className="max-w-[794px] mx-auto">
          {renderTemplate()}
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Made with <Link to="/" className="text-primary hover:underline font-medium">Resume Builder</Link>
      </footer>
    </div>
  );
};

export default SharedResume;
