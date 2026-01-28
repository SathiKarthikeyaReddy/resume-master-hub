import { useState } from "react";
import { Wrench, Plus, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SkillsSectionProps {
  data: string[];
  onChange: (data: string[]) => void;
  jobTitles?: string[];
  companies?: string[];
}

const SkillsSection = ({ data, onChange, jobTitles = [], companies = [] }: SkillsSectionProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { toast } = useToast();

  const addSkill = () => {
    const skill = inputValue.trim();
    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleAISuggestions = async () => {
    setIsLoadingAI(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("ai-resume-helper", {
        body: {
          type: "skills",
          currentContent: "",
          context: {
            jobTitles,
            companies,
            existingSkills: data,
          },
        },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast({
            title: "Rate limit reached",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (result?.suggestion) {
        const suggestedSkills = result.suggestion
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s && !data.includes(s));
        
        if (suggestedSkills.length > 0) {
          onChange([...data, ...suggestedSkills]);
          toast({
            title: "Skills added!",
            description: `Added ${suggestedSkills.length} AI-suggested skills.`,
          });
        } else {
          toast({
            title: "No new skills found",
            description: "All suggested skills are already in your list.",
          });
        }
      }
    } catch (error) {
      console.error("AI skills error:", error);
      toast({
        title: "Could not get suggestions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const suggestedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "Agile",
  ];

  const filteredSuggestions = suggestedSkills.filter(
    (skill) =>
      !data.includes(skill) &&
      skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Wrench className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Skills</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAISuggestions}
          disabled={isLoadingAI}
          className="gap-1.5 text-xs"
        >
          {isLoadingAI ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Suggesting...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              AI Suggest Skills
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={addSkill} variant="outline" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Current Skills */}
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {filteredSuggestions.slice(0, 5).map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  onChange([...data, skill]);
                  setInputValue("");
                }}
                className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 && !inputValue && (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <Wrench className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Add skills to showcase your expertise
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {suggestedSkills.slice(0, 5).map((skill) => (
              <button
                key={skill}
                onClick={() => onChange([...data, skill])}
                className="text-xs px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
