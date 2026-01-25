import { useState } from "react";
import { Eye, Edit3, Save, Download } from "lucide-react";
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
import { ResumeData, defaultResumeData } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const isMobile = useIsMobile();

  const updateResumeData = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K]
  ) => {
    setResumeData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                <PromoCarousel />

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
                    <Button variant="hero" className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      Save Resume
                    </Button>
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
