import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, defaultResumeData, defaultSectionOrder } from "@/types/resume";
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

  useEffect(() => {
    const load = async () => {
      if (!slug) { setError("Invalid link"); setIsLoading(false); return; }

      const { data: shared, error: shareErr } = await (supabase as any)
        .from("shared_resumes")
        .select("resume_id, is_active, view_count")
        .eq("slug", slug)
        .maybeSingle();

      if (shareErr || !shared || !shared.is_active) {
        setError("This resume is not available or the link has expired.");
        setIsLoading(false);
        return;
      }

      // Increment view count
      await (supabase as any)
        .from("shared_resumes")
        .update({ view_count: (shared.view_count || 0) + 1 })
        .eq("slug", slug);

      // Get resume content
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
      });
      if (content.template) setTemplate(content.template);
      setIsLoading(false);
    };

    load();
  }, [slug]);

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Resume Unavailable</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (template) {
      case "modern": return <ModernTemplate data={resumeData} />;
      case "minimal": return <MinimalTemplate data={resumeData} />;
      case "creative": return <CreativeTemplate data={resumeData} />;
      case "executive": return <ExecutiveTemplate data={resumeData} />;
      case "classic": default: return <ClassicTemplate data={resumeData} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-[794px] mx-auto">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default SharedResume;
