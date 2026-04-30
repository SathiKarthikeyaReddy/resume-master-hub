import { useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeData } from "@/types/resume";
import { detectWeakOpener } from "@/lib/actionVerbs";

interface Props {
  data: ResumeData;
}

interface Check {
  name: string;
  category: "Format" | "Content" | "Keywords" | "Length";
  passed: boolean;
  message: string;
  weight: number;
}

const QUANTIFIER_RE = /\b\d+(\.\d+)?(\s?(%|k|m|x|hours?|days?|users|customers|clients|million|billion|years?|months?))?\b/i;

const computeChecks = (data: ResumeData): Check[] => {
  const { personalInfo, summary, experience, education, skills } = data;
  const checks: Check[] = [];

  // Format checks
  checks.push({
    name: "Contact information complete",
    category: "Format",
    passed: !!(personalInfo.fullName && personalInfo.email && personalInfo.phone),
    message: "Include name, email, and phone — recruiters need to reach you.",
    weight: 10,
  });
  checks.push({
    name: "Location provided",
    category: "Format",
    passed: !!personalInfo.location,
    message: "Add a city/region — many ATS rank by location.",
    weight: 5,
  });
  checks.push({
    name: "LinkedIn or portfolio link",
    category: "Format",
    passed: !!(personalInfo.linkedin || personalInfo.website),
    message: "Add LinkedIn or a portfolio URL to boost recruiter discovery.",
    weight: 5,
  });

  // Content checks
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    name: "Professional summary present (40–120 words)",
    category: "Content",
    passed: summaryWords >= 40 && summaryWords <= 120,
    message: summaryWords === 0
      ? "Add a concise summary (40–120 words)."
      : summaryWords < 40
      ? "Summary is too short — aim for at least 40 words."
      : "Summary is too long — trim to under 120 words.",
    weight: 8,
  });

  checks.push({
    name: "At least one work experience",
    category: "Content",
    passed: experience.length > 0,
    message: "Add at least one position with achievements.",
    weight: 12,
  });

  // Bullet quality
  const allBullets = experience.flatMap((e) => e.bullets).filter((b) => b.trim());
  const quantifiedCount = allBullets.filter((b) => QUANTIFIER_RE.test(b)).length;
  checks.push({
    name: "Quantified achievements (numbers, %, $)",
    category: "Content",
    passed: allBullets.length > 0 && quantifiedCount / allBullets.length >= 0.4,
    message:
      allBullets.length === 0
        ? "Add bullet points to your experience."
        : `Only ${quantifiedCount} of ${allBullets.length} bullets include numbers. Aim for at least 40%.`,
    weight: 12,
  });

  // Weak openers
  const weakBullets = allBullets.filter((b) => detectWeakOpener(b));
  checks.push({
    name: "No weak phrases ('responsible for', 'worked on', …)",
    category: "Content",
    passed: weakBullets.length === 0,
    message:
      weakBullets.length === 0
        ? "Great — strong action verbs throughout."
        : `${weakBullets.length} bullet(s) start with weak phrases. Replace with action verbs.`,
    weight: 8,
  });

  checks.push({
    name: "Education listed",
    category: "Content",
    passed: education.length > 0,
    message: "Add at least one education entry.",
    weight: 6,
  });

  // Keywords
  checks.push({
    name: "5+ skills listed",
    category: "Keywords",
    passed: skills.length >= 5,
    message: `Add more skills (currently ${skills.length}). 8–15 is ideal.`,
    weight: 10,
  });

  checks.push({
    name: "10+ skills for keyword density",
    category: "Keywords",
    passed: skills.length >= 10,
    message: "Boost keyword density with more relevant skills.",
    weight: 6,
  });

  // Length
  const totalWords =
    summaryWords +
    allBullets.reduce((sum, b) => sum + b.trim().split(/\s+/).length, 0) +
    education.reduce((s, e) => s + (e.description?.split(/\s+/).length || 0), 0);
  checks.push({
    name: "Resume length appropriate (250–800 words)",
    category: "Length",
    passed: totalWords >= 250 && totalWords <= 800,
    message:
      totalWords < 250
        ? `Resume is too short (${totalWords} words). Add more detail.`
        : totalWords > 800
        ? `Resume is too long (${totalWords} words). Trim to under 800.`
        : `Length is good (${totalWords} words).`,
    weight: 8,
  });

  // Avoid photos for ATS
  checks.push({
    name: "ATS-safe (no photo recommended for US/UK)",
    category: "Format",
    passed: !data.personalInfo.photoUrl || !(data.templateCustomization?.showPhoto),
    message: "Photos can confuse ATS in many regions. Hide it for ATS-only submissions.",
    weight: 4,
  });

  // Standard sections
  checks.push({
    name: "Standard section names used",
    category: "Format",
    passed: true, // We use standard names like Experience, Education, Skills
    message: "Your section names are ATS-standard.",
    weight: 6,
  });

  return checks;
};

const ATSScoreDialog = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const checks = useMemo(() => computeChecks(data), [data]);

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const passedWeight = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((passedWeight / totalWeight) * 100);

  const grade = score >= 90 ? "Excellent" : score >= 75 ? "Strong" : score >= 60 ? "Good" : score >= 40 ? "Needs work" : "Poor";
  const gradeColor = score >= 75 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-destructive";

  const failed = checks.filter((c) => !c.passed);
  const passed = checks.filter((c) => c.passed);

  const byCategory = (cat: Check["category"]) => failed.filter((c) => c.category === cat);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          ATS Score
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            ATS Compatibility Score
          </DialogTitle>
          <DialogDescription>
            Real-time analysis of how well your resume will perform in Applicant Tracking Systems.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="text-center p-6 bg-muted/40 rounded-lg mb-4">
            <div className={`text-5xl font-bold ${gradeColor}`}>{score}</div>
            <div className="text-sm text-muted-foreground mt-1">{grade}</div>
            <Progress value={score} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-3">
              {passed.length} of {checks.length} checks passed
            </p>
          </div>

          {failed.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Improvements ({failed.length})
              </h3>
              {(["Content", "Keywords", "Format", "Length"] as const).map((cat) => {
                const items = byCategory(cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{cat}</p>
                    <ul className="space-y-2">
                      {items.map((c) => (
                        <li key={c.name} className="flex items-start gap-2 text-sm bg-amber-500/5 border border-amber-500/20 rounded-md p-3">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-medium text-foreground">{c.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{c.message}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {passed.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Passing ({passed.length})
              </h3>
              <ul className="space-y-1">
                {passed.map((c) => (
                  <li key={c.name} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ATSScoreDialog;
