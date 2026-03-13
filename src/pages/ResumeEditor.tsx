import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, Edit3, Save, Download, Share2, FileDown } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PromoCarousel from "@/components/editor/PromoCarousel";
import NativeAdCard from "@/components/editor/NativeAdCard";
import PersonalInfoSection from "@/components/editor/PersonalInfoSection";
import SummarySection from "@/components/editor/SummarySection";
import ExperienceSection from "@/components/editor/ExperienceSection";
import EducationSection from "@/components/editor/EducationSection";
import SkillsSection from "@/components/editor/SkillsSection";
import CertificationsSection from "@/components/editor/CertificationsSection";
import ProjectsSection from "@/components/editor/ProjectsSection";
import LanguagesSection from "@/components/editor/LanguagesSection";
import VolunteerSection from "@/components/editor/VolunteerSection";
import AwardsSection from "@/components/editor/AwardsSection";
import ReferencesSection from "@/components/editor/ReferencesSection";
import CustomSectionsEditor from "@/components/editor/CustomSectionsEditor";
import ResumeStrengthMeter from "@/components/editor/ResumeStrengthMeter";
import GoProButton from "@/components/editor/GoProButton";
import TemplateSelector, { TemplateType } from "@/components/editor/TemplateSelector";
import TemplateCustomizer from "@/components/editor/TemplateCustomizer";
import SectionReorder from "@/components/editor/SectionReorder";
import ClassicTemplate from "@/components/editor/templates/ClassicTemplate";
import ModernTemplate from "@/components/editor/templates/ModernTemplate";
import MinimalTemplate from "@/components/editor/templates/MinimalTemplate";
import CreativeTemplate from "@/components/editor/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/editor/templates/ExecutiveTemplate";
import JobAnalyzer from "@/components/editor/JobAnalyzer";
import CoverLetterGenerator from "@/components/editor/CoverLetterGenerator";
import ResumeImport from "@/components/editor/ResumeImport";
import CollaboratorPresence from "@/components/editor/CollaboratorPresence";
import VersionHistory from "@/components/editor/VersionHistory";
import SaveIndicator from "@/components/SaveIndicator";
import ShareResumeDialog from "@/components/editor/ShareResumeDialog";
import { ResumeData, defaultResumeData, defaultSectionOrder, defaultTemplateCustomization, TemplateCustomization } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResumeAutoSave } from "@/hooks/useResumeAutoSave";
import { useResumeStrength } from "@/hooks/useResumeStrength";
import { useResumeCollaboration } from "@/hooks/useResumeCollaboration";
import { useResumeVersions } from "@/hooks/useResumeVersions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [resumeId, setResumeId] = useState<string | null>(id || null);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [template, setTemplate] = useState<TemplateType>("classic");
  const [showShare, setShowShare] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);

  const { saveStatus } = useResumeAutoSave({ resumeId, resumeData, debounceMs: 2000 });
  const strength = useResumeStrength(resumeData);
  const { versions, isLoading: versionsLoading, fetchVersions, restoreVersion } = useResumeVersions(resumeId);

  const handleRemoteUpdate = useCallback((data: ResumeData) => { setResumeData(data); }, []);
  const { collaborators, isConnected, broadcastUpdate } = useResumeCollaboration({ resumeId, resumeData, onRemoteUpdate: handleRemoteUpdate });

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resumeData.personalInfo.fullName || "Resume",
    pageStyle: `@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
  });

  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        const { data, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
        if (error) {
          toast({ title: "Error loading resume", description: "Could not load the resume.", variant: "destructive" });
          navigate("/dashboard");
          return;
        }
        if (data?.content) {
          const content = data.content as unknown as ResumeData & { template?: TemplateType };
          setResumeData({
            ...defaultResumeData,
            ...content,
            personalInfo: { ...defaultResumeData.personalInfo, ...content.personalInfo },
            sectionOrder: content.sectionOrder || defaultSectionOrder,
            references: content.references || [],
            customSections: content.customSections || [],
            templateCustomization: content.templateCustomization || defaultTemplateCustomization,
          });
          setResumeId(data.id);
          if (content.template) setTemplate(content.template);
        }
      }
      setIsLoading(false);
    };
    loadResume();
  }, [id, navigate, toast]);

  const createNewResume = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({ title: "Please sign in", description: "You need to be signed in to save your resume.", variant: "destructive" });
      return;
    }
    const contentWithTemplate = { ...resumeData, template };
    const { data, error } = await supabase.from("resumes").insert({
      user_id: user.user.id,
      title: resumeData.personalInfo.fullName || "Untitled Resume",
      content: JSON.parse(JSON.stringify(contentWithTemplate)),
    }).select().single();
    if (error) {
      toast({ title: "Error saving resume", description: "Could not save the resume.", variant: "destructive" });
      return;
    }
    setResumeId(data.id);
    navigate(`/editor/${data.id}`, { replace: true });
    toast({ title: "Resume created", description: "Your resume has been saved." });
  };

  const updateResumeData = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setResumeData((prev) => {
      const newData = { ...prev, [key]: value };
      broadcastUpdate(newData);
      return newData;
    });
  };

  const handleImportResume = (importedData: Partial<ResumeData>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...importedData.personalInfo },
      summary: importedData.summary || prev.summary,
      experience: importedData.experience?.length ? importedData.experience : prev.experience,
      education: importedData.education?.length ? importedData.education : prev.education,
      skills: importedData.skills?.length ? importedData.skills : prev.skills,
    }));
  };

  const handleAddSkillFromAnalysis = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      updateResumeData("skills", [...resumeData.skills, skill]);
      toast({ title: "Skill added", description: `"${skill}" has been added to your skills.` });
    }
  };

  const handleGoPro = () => {
    setIsPro(!isPro);
    toast({
      title: isPro ? "Pro mode deactivated" : "Pro mode activated!",
      description: isPro ? "Ads will now be shown." : "All ads have been hidden. Enjoy your clean workspace!",
    });
  };

  const handleExportTxt = () => {
    const { personalInfo, summary, experience, education, skills } = resumeData;
    let txt = `${personalInfo.fullName}\n${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n`;
    if (personalInfo.linkedin) txt += `LinkedIn: ${personalInfo.linkedin}\n`;
    if (personalInfo.website) txt += `Website: ${personalInfo.website}\n`;
    txt += `\nPROFESSIONAL SUMMARY\n${summary}\n`;
    if (experience.length) {
      txt += `\nWORK EXPERIENCE\n`;
      experience.forEach((e) => {
        txt += `\n${e.jobTitle} at ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate})\n`;
        e.bullets.filter((b) => b.trim()).forEach((b) => { txt += `  • ${b}\n`; });
      });
    }
    if (education.length) {
      txt += `\nEDUCATION\n`;
      education.forEach((e) => { txt += `${e.degree} - ${e.institution} (${e.graduationDate})\n`; });
    }
    if (skills.length) txt += `\nSKILLS\n${skills.join(", ")}\n`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${personalInfo.fullName || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "personalInfo":
        return <PersonalInfoSection key="personalInfo" data={resumeData.personalInfo} onChange={(data) => updateResumeData("personalInfo", data)} />;
      case "summary":
        return <div key="summary" className="border-t border-border pt-6"><SummarySection data={resumeData.summary} onChange={(data) => updateResumeData("summary", data)} /></div>;
      case "experience":
        return <div key="experience" className="border-t border-border pt-6"><ExperienceSection data={resumeData.experience} onChange={(data) => updateResumeData("experience", data)} /></div>;
      case "education":
        return <div key="education" className="border-t border-border pt-6"><EducationSection data={resumeData.education} onChange={(data) => updateResumeData("education", data)} /></div>;
      case "skills":
        return <div key="skills" className="border-t border-border pt-6"><SkillsSection data={resumeData.skills} onChange={(data) => updateResumeData("skills", data)} jobTitles={resumeData.experience.map(e => e.jobTitle).filter(Boolean)} companies={resumeData.experience.map(e => e.company).filter(Boolean)} /></div>;
      case "certifications":
        return <div key="certifications" className="border-t border-border pt-6"><CertificationsSection data={resumeData.certifications || []} onChange={(data) => updateResumeData("certifications", data)} /></div>;
      case "projects":
        return <div key="projects" className="border-t border-border pt-6"><ProjectsSection data={resumeData.projects || []} onChange={(data) => updateResumeData("projects", data)} /></div>;
      case "languages":
        return <div key="languages" className="border-t border-border pt-6"><LanguagesSection data={resumeData.languages || []} onChange={(data) => updateResumeData("languages", data)} /></div>;
      case "volunteer":
        return <div key="volunteer" className="border-t border-border pt-6"><VolunteerSection data={resumeData.volunteer || []} onChange={(data) => updateResumeData("volunteer", data)} /></div>;
      case "awards":
        return <div key="awards" className="border-t border-border pt-6"><AwardsSection data={resumeData.awards || []} onChange={(data) => updateResumeData("awards", data)} /></div>;
      case "references":
        return <ReferencesSection key="references" data={resumeData.references || []} onChange={(data) => updateResumeData("references", data)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const sectionOrder = resumeData.sectionOrder || defaultSectionOrder;

  return (
    <div className="min-h-screen bg-background">
      <Navbar saveStatus={saveStatus} />

      {isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full shadow-lg">
            <Button variant={activeView === "editor" ? "default" : "ghost"} size="sm" onClick={() => setActiveView("editor")} className="rounded-full gap-1">
              <Edit3 className="w-4 h-4" />Edit
            </Button>
            <Button variant={activeView === "preview" ? "default" : "ghost"} size="sm" onClick={() => setActiveView("preview")} className="rounded-full gap-1">
              <Eye className="w-4 h-4" />Preview
            </Button>
          </div>
        </div>
      )}

      <main className="pt-16">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
          <div className={`w-full lg:w-1/2 ${isMobile && activeView !== "editor" ? "hidden" : ""}`}>
            <ScrollArea className="h-full">
              <div className="p-6 pb-24 lg:pb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <CollaboratorPresence collaborators={collaborators} isConnected={isConnected} />
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div className="flex flex-wrap gap-2">
                      <ResumeImport onImport={handleImportResume} />
                      <JobAnalyzer resumeData={resumeData} onAddSkill={handleAddSkillFromAnalysis} />
                      <CoverLetterGenerator resumeData={resumeData} />
                      <VersionHistory versions={versions} isLoading={versionsLoading} onOpen={fetchVersions} onRestore={async (v) => { const restored = await restoreVersion(v); if (restored) setResumeData(restored); return restored; }} />
                      {resumeId && (
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setShowShare(true)}>
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </Button>
                      )}
                    </div>
                  </div>
                  <GoProButton isPro={isPro} onToggle={handleGoPro} />
                </div>

                {!isPro && <PromoCarousel autoPlayInterval={8000} />}
                <TemplateSelector selected={template} onChange={setTemplate} />
                <TemplateCustomizer
                  customization={customization}
                  onChange={(c) => updateResumeData("templateCustomization", c)}
                />
                <SectionReorder
                  order={sectionOrder}
                  onChange={(order) => updateResumeData("sectionOrder", order)}
                />

                <div className="mb-6">
                  <ResumeStrengthMeter percentage={strength.percentage} label={strength.label} completedSections={strength.completedSections} missingSections={strength.missingSections} />
                </div>

                <div className="space-y-8">
                  {sectionOrder.map((key) => renderSection(key))}

                  {/* Custom Sections */}
                  <CustomSectionsEditor
                    sections={resumeData.customSections || []}
                    onChange={(sections) => updateResumeData("customSections", sections)}
                  />

                  {!isPro && (
                    <NativeAdCard title="Resume Review Service" description="Get expert feedback on your resume from HR professionals. First review free!" ctaText="Get Free Review" />
                  )}

                  <div className="flex gap-3 pt-4">
                    {!resumeId ? (
                      <Button variant="hero" className="flex-1 gap-2" onClick={createNewResume}>
                        <Save className="w-4 h-4" />Save Resume
                      </Button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <SaveIndicator status={saveStatus} />
                        {saveStatus === "idle" && "Auto-save enabled"}
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 gap-2">
                          <FileDown className="w-4 h-4" />Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handlePrint()}>
                          <Download className="w-4 h-4 mr-2" />Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportTxt}>
                          <FileDown className="w-4 h-4 mr-2" />Export as TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportJson}>
                          <FileDown className="w-4 h-4 mr-2" />Export as JSON
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className={`w-full lg:w-1/2 bg-muted/30 border-l border-border ${isMobile && activeView !== "preview" ? "hidden" : ""}`}>
            <div className="sticky top-0 h-full overflow-auto p-4 lg:p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">ATS-Friendly</span>
              </div>
              <div className="transform scale-[0.7] lg:scale-[0.8] origin-top">
                <div ref={resumeRef}>{renderTemplate()}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {resumeId && (
        <ShareResumeDialog resumeId={resumeId} open={showShare} onOpenChange={setShowShare} />
      )}
    </div>
  );
};

export default ResumeEditor;
