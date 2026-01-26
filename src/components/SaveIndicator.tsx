import { Check, Cloud, CloudOff, Loader2 } from "lucide-react";
import { SaveStatus } from "@/hooks/useResumeAutoSave";

interface SaveIndicatorProps {
  status: SaveStatus;
}

const SaveIndicator = ({ status }: SaveIndicatorProps) => {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {status === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Cloud className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="w-3.5 h-3.5 text-destructive" />
          <span className="text-destructive">Error</span>
        </>
      )}
    </div>
  );
};

export default SaveIndicator;
