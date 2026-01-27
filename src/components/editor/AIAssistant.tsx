import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  type: "summary" | "bullet";
  currentContent: string;
  context?: {
    jobTitle?: string;
    company?: string;
  };
  onSuggestion: (suggestion: string) => void;
}

const AIAssistant = ({ type, currentContent, context, onSuggestion }: AIAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-resume-helper", {
        body: {
          type,
          currentContent,
          context,
        },
      });

      if (error) {
        // Handle rate limits
        if (error.message?.includes("429") || error.message?.includes("rate")) {
          toast({
            title: "Rate limit reached",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data?.suggestion) {
        onSuggestion(data.suggestion);
        toast({
          title: "AI suggestion applied!",
          description: "Feel free to edit the suggestion to match your style.",
        });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        title: "Could not get suggestion",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGetSuggestion}
      disabled={isLoading}
      className="gap-1.5 text-xs"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3" />
          {type === "summary" ? "Improve with AI" : "Enhance"}
        </>
      )}
    </Button>
  );
};

export default AIAssistant;
