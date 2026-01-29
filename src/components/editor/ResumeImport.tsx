import { useState, useRef } from "react";
import { Upload, FileUp, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

interface ResumeImportProps {
  onImport: (data: Partial<ResumeData>) => void;
}

const ResumeImport = ({ onImport }: ResumeImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseResumeText = async (text: string) => {
    if (!text.trim()) {
      setError("Please paste your resume text or upload a file.");
      return;
    }

    setIsParsing(true);
    setError("");

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("ai-resume-helper", {
        body: {
          type: "parse-resume",
          context: {
            resumeText: text,
          },
        },
      });

      if (invokeError) throw invokeError;

      if (data?.suggestion) {
        const parsed = data.suggestion;
        
        // Generate IDs for experience and education entries
        const processedData: Partial<ResumeData> = {
          personalInfo: parsed.personalInfo || {},
          summary: parsed.summary || "",
          experience: (parsed.experience || []).map((exp: Partial<ResumeData["experience"][0]>, idx: number) => ({
            ...exp,
            id: `imported-exp-${idx}-${Date.now()}`,
          })),
          education: (parsed.education || []).map((edu: Partial<ResumeData["education"][0]>, idx: number) => ({
            ...edu,
            id: `imported-edu-${idx}-${Date.now()}`,
          })),
          skills: parsed.skills || [],
        };

        onImport(processedData);
        setIsOpen(false);
        setPastedText("");
        toast({
          title: "Resume imported!",
          description: "Your resume data has been imported. Review and edit as needed.",
        });
      }
    } catch (err) {
      console.error("Resume parsing error:", err);
      setError("Failed to parse the resume. Please try again or paste in a different format.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["text/plain", "application/pdf"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      setError("Please upload a .txt or .pdf file. For best results, copy and paste your resume text.");
      return;
    }

    setIsParsing(true);
    setError("");

    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        await parseResumeText(text);
      } else {
        // For PDF, we'll show a message to paste text instead
        setError("PDF parsing is limited. For best results, please copy and paste your resume text directly.");
        setIsParsing(false);
      }
    } catch (err) {
      console.error("File reading error:", err);
      setError("Failed to read the file. Please try copying and pasting the text instead.");
      setIsParsing(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Import Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Import Existing Resume
          </DialogTitle>
          <DialogDescription>
            Paste your resume text or upload a file to auto-fill the editor.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <Textarea
              placeholder="Paste your resume text here... (Copy from your LinkedIn profile, existing resume PDF, or Word document)"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="min-h-[250px] text-sm"
            />
            <Button
              onClick={() => parseResumeText(pastedText)}
              disabled={isParsing || !pastedText.trim()}
              className="w-full gap-2"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing Resume...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import Resume
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .txt files (PDF support is limited)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,text/plain,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {isParsing && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing file...
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p className="font-medium mb-1">Tips for best results:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Copy text directly from LinkedIn or your resume document</li>
            <li>Include section headers like "Experience", "Education", "Skills"</li>
            <li>Include dates in a recognizable format (e.g., "Jan 2020 - Present")</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeImport;
