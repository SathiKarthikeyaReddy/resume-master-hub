import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseResumeAutoSaveProps {
  resumeId: string | null;
  resumeData: ResumeData;
  debounceMs?: number;
  /** When true, skip the next auto-save (used to prevent loops on remote-driven updates). */
  skipNext?: boolean;
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
  skipNext = false,
}: UseResumeAutoSaveProps): UseResumeAutoSaveReturn => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const lastSerialized = useRef<string>("");
  const skipNextRef = useRef(false);
  const { toast } = useToast();

  // Update skip flag when external one changes
  useEffect(() => {
    if (skipNext) skipNextRef.current = true;
  }, [skipNext]);

  const save = useCallback(async () => {
    if (!resumeId) return;
    const serialized = JSON.stringify(resumeData);
    if (serialized === lastSerialized.current) return; // no real change

    setSaveStatus("saving");

    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          content: JSON.parse(serialized),
          updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId);

      if (error) throw error;

      lastSerialized.current = serialized;
      setSaveStatus("saved");
      setLastSaved(new Date());

      setTimeout(() => setSaveStatus("idle"), 3000);
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastSerialized.current = JSON.stringify(resumeData);
      return;
    }

    if (!resumeId) return;

    if (skipNextRef.current) {
      skipNextRef.current = false;
      lastSerialized.current = JSON.stringify(resumeData);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [resumeData, resumeId, debounceMs, save]);

  return { saveStatus, lastSaved, save };
};
