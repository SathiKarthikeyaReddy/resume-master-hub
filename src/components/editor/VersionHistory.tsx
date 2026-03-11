import { useState } from "react";
import { History, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeVersion } from "@/hooks/useResumeVersions";
import { ResumeData } from "@/types/resume";

interface VersionHistoryProps {
  versions: ResumeVersion[];
  isLoading: boolean;
  onOpen: () => void;
  onRestore: (version: ResumeVersion) => Promise<ResumeData | null>;
}

const VersionHistory = ({
  versions,
  isLoading,
  onOpen,
  onRestore,
}: VersionHistoryProps) => {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleRestore = async (version: ResumeVersion) => {
    setRestoringId(version.id);
    const result = await onRestore(version);
    setRestoringId(null);
    if (result) setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (v) onOpen(); }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-6rem)] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              Loading versions…
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No previous versions yet. Versions are saved automatically when you edit.
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Version {v.version_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(v.created_at), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 shrink-0"
                    disabled={restoringId === v.id}
                    onClick={() => handleRestore(v)}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {restoringId === v.id ? "Restoring…" : "Restore"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default VersionHistory;
