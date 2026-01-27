import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AIAssistant from "@/components/editor/AIAssistant";

interface SummarySectionProps {
  data: string;
  onChange: (data: string) => void;
}

const SummarySection = ({ data, onChange }: SummarySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Professional Summary</h3>
        </div>
        <AIAssistant
          type="summary"
          currentContent={data}
          onSuggestion={onChange}
        />
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm text-muted-foreground">
          Write a brief summary of your professional background (2-4 sentences)
        </Label>
        <Textarea
          id="summary"
          placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers..."
          value={data}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {data.length}/500 characters
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
