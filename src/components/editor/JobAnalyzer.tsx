import { useState } from "react";
import { Target, Loader2, CheckCircle, AlertCircle, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

interface JobAnalyzerProps {
  resumeData: ResumeData;
  onAddSkill?: (skill: string) => void;
  onUpdateSummary?: (summary: string) => void;
}

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  skillsToAdd: string[];
  bulletImprovements: { original: string; suggestion: string }[];
  summaryTips: string[];
  overallTips: string[];
}

const JobAnalyzer = ({ resumeData, onAddSkill, onUpdateSummary }: JobAnalyzerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste a job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-resume-helper", {
        body: {
          type: "job-analysis",
          context: {
            resumeData,
            jobDescription,
          },
        },
      });

      if (error) throw error;

      if (data?.suggestion) {
        setAnalysis(data.suggestion);
      }
    } catch (error) {
      console.error("Job analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="w-4 h-4" />
          Analyze Job Match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Job Description Analyzer
          </DialogTitle>
          <DialogDescription>
            Paste a job description to see how well your resume matches and get improvement suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!analysis ? (
            <>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Analyze Match
                  </>
                )}
              </Button>
            </>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Match Score */}
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                    {analysis.matchScore}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getScoreLabel(analysis.matchScore)}
                  </div>
                  <Progress value={analysis.matchScore} className="mt-3" />
                </div>

                {/* Missing Keywords */}
                {analysis.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Missing Keywords
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      These keywords appear in the job description but not in your resume:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.missingKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills to Add */}
                {analysis.skillsToAdd?.length > 0 && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Recommended Skills
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Consider adding these skills if you have them:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skillsToAdd.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => onAddSkill?.(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bullet Improvements */}
                {analysis.bulletImprovements?.length > 0 && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      Bullet Point Improvements
                    </h4>
                    <div className="space-y-3">
                      {analysis.bulletImprovements.map((item, idx) => (
                        <div key={idx} className="bg-muted/30 rounded-lg p-3 text-sm">
                          <div className="text-muted-foreground line-through text-xs mb-1">
                            {item.original}
                          </div>
                          <div className="text-foreground">
                            → {item.suggestion}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Tips */}
                {analysis.summaryTips?.length > 0 && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      Summary Improvements
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {analysis.summaryTips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Overall Tips */}
                {analysis.overallTips?.length > 0 && (
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      General Recommendations
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {analysis.overallTips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setAnalysis(null)}
                  className="w-full"
                >
                  Analyze Another Job
                </Button>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobAnalyzer;
