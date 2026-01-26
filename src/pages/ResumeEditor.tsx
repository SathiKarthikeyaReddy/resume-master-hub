import { useState, useEffect } from "react";
import { Eye, Edit3, Save, Download } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PromoCarousel from "@/components/editor/PromoCarousel";
import NativeAdCard from "@/components/editor/NativeAdCard";
import PersonalInfoSection from "@/components/editor/PersonalInfoSection";
import SummarySection from "@/components/editor/SummarySection";
import ExperienceSection from "@/components/editor/ExperienceSection";
import EducationSection from "@/components/editor/EducationSection";
import SkillsSection from "@/components/editor/SkillsSection";
import ResumePreview from "@/components/editor/ResumePreview";
import SaveIndicator from "@/components/SaveIndicator";
import { ResumeData, defaultResumeData } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResumeAutoSave, SaveStatus } from "@/hooks/useResumeAutoSave";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [resumeId, setResumeId] = useState<string | null>(id || null);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { saveStatus } = useResumeAutoSave({
    resumeId,
    resumeData,
    debounceMs: 2000,
  });

  // Load resume data if editing existing
  useEffect(() => {
    const loadResume = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Error loading resume:", error);
          toast({
            title: "Error loading resume",
            description: "Could not load the resume. Please try again.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        if (data?.content) {
          setResumeData(data.content as unknown as ResumeData);
          setResumeId(data.id);
        }
      }
      setIsLoading(false);
    };

    loadResume();
  }, [id, navigate, toast]);

  // Create new resume if none exists
  const createNewResume = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your resume.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.user.id,
        title: resumeData.personalInfo.fullName || "Untitled Resume",
        content: JSON.parse(JSON.stringify(resumeData)),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating resume:", error);
      toast({
        title: "Error saving resume",
        description: "Could not save the resume. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setResumeId(data.id);
    navigate(`/editor/${data.id}`, { replace: true });
    toast({
      title: "Resume created",
      description: "Your resume has been saved.",
    });
  };

  const updateResumeData = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K]
  ) => {
    setResumeData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar saveStatus={saveStatus} />

      {/* Mobile View Toggle */}
      {isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full shadow-lg">
            <Button
              variant={activeView === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("editor")}
              className="rounded-full gap-1"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant={activeView === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("preview")}
              className="rounded-full gap-1"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </div>
      )}

      <main className="pt-16">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
          {/* Left Side - Editor Form */}
          <div
            className={`w-full lg:w-1/2 ${
              isMobile && activeView !== "editor" ? "hidden" : ""
            }`}
          >
            <ScrollArea className="h-full">
              <div className="p-6 pb-24 lg:pb-6">
                {/* Promo Carousel */}
                <PromoCarousel autoPlayInterval={8000} />

                {/* Form Sections */}
                <div className="space-y-8">
                  <PersonalInfoSection
                    data={resumeData.personalInfo}
                    onChange={(data) => updateResumeData("personalInfo", data)}
                  />

                  <div className="border-t border-border pt-6">
                    <SummarySection
                      data={resumeData.summary}
                      onChange={(data) => updateResumeData("summary", data)}
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <ExperienceSection
                      data={resumeData.experience}
                      onChange={(data) => updateResumeData("experience", data)}
                    />
                  </div>

                  {/* Native Ad Placement */}
                  <NativeAdCard
                    title="Resume Review Service"
                    description="Get expert feedback on your resume from HR professionals. First review free!"
                    ctaText="Get Free Review"
                  />

                  <div className="border-t border-border pt-6">
                    <EducationSection
                      data={resumeData.education}
                      onChange={(data) => updateResumeData("education", data)}
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <SkillsSection
                      data={resumeData.skills}
                      onChange={(data) => updateResumeData("skills", data)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {!resumeId ? (
                      <Button
                        variant="hero"
                        className="flex-1 gap-2"
                        onClick={createNewResume}
                      >
                        <Save className="w-4 h-4" />
                        Save Resume
                      </Button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <SaveIndicator status={saveStatus} />
                        {saveStatus === "idle" && "Auto-save enabled"}
                      </div>
                    )}
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Preview */}
          <div
            className={`w-full lg:w-1/2 bg-muted/30 border-l border-border ${
              isMobile && activeView !== "preview" ? "hidden" : ""
            }`}
          >
            <div className="sticky top-0 h-full overflow-auto p-4 lg:p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Live Preview
                </h2>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">
                  ATS-Friendly
                </span>
              </div>
              <div className="transform scale-[0.7] lg:scale-[0.8] origin-top">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeEditor;
