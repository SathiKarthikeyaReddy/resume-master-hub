import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

export interface ResumeVersion {
  id: string;
  resume_id: string;
  version_number: number;
  content: ResumeData;
  created_at: string;
}

export const useResumeVersions = (resumeId: string | null) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchVersions = useCallback(async () => {
    if (!resumeId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("resume_id", resumeId)
      .order("version_number", { ascending: false });

    if (error) {
      console.error("Error fetching versions:", error);
    } else {
      setVersions(
        (data || []).map((v) => ({
          ...v,
          content: v.content as unknown as ResumeData,
        }))
      );
    }
    setIsLoading(false);
  }, [resumeId]);

  const restoreVersion = useCallback(
    async (version: ResumeVersion): Promise<ResumeData | null> => {
      if (!resumeId) return null;
      const { error } = await supabase
        .from("resumes")
        .update({
          content: JSON.parse(JSON.stringify(version.content)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId);

      if (error) {
        toast({
          title: "Error restoring version",
          description: "Could not restore this version. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Version restored",
        description: `Restored to version ${version.version_number}.`,
      });
      return version.content;
    },
    [resumeId, toast]
  );

  return { versions, isLoading, fetchVersions, restoreVersion };
};
