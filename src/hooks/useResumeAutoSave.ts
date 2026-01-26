import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseResumeAutoSaveProps {
  resumeId: string | null;
  resumeData: ResumeData;
  debounceMs?: number;
}

interface UseResumeAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  save: () => Promise<void>;
}

export const useResumeAutoSave = ({
  resumeId,
  resumeData,
  debounceMs = 2000,
}: UseResumeAutoSaveProps): UseResumeAutoSaveReturn => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const { toast } = useToast();

  const save = useCallback(async () => {
    if (!resumeId) return;

    setSaveStatus("saving");

    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          content: JSON.parse(JSON.stringify(resumeData)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId);

      if (error) throw error;

      setSaveStatus("saved");
      setLastSaved(new Date());

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus("error");
      toast({
        title: "Failed to save",
        description: "Your changes couldn't be saved. Please try again.",
        variant: "destructive",
      });
    }
  }, [resumeId, resumeData, toast]);

  // Debounced auto-save
  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!resumeId) return;

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [resumeData, resumeId, debounceMs, save]);

  return {
    saveStatus,
    lastSaved,
    save,
  };
};
