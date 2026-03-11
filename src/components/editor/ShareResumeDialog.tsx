import { useState, useEffect } from "react";
import { Copy, Check, Link2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShareResumeDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareResumeDialog = ({ resumeId, open, onOpenChange }: ShareResumeDialogProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && resumeId) {
      loadShareStatus();
    }
  }, [open, resumeId]);

  const loadShareStatus = async () => {
    const { data } = await supabase
      .from("shared_resumes")
      .select("*")
      .eq("resume_id", resumeId)
      .maybeSingle();

    if (data) {
      setIsPublic(data.is_active);
      setShareSlug(data.slug);
      setViewCount(data.view_count || 0);
    } else {
      setIsPublic(false);
      setShareSlug(null);
      setViewCount(0);
    }
  };

  const toggleSharing = async () => {
    setIsLoading(true);
    try {
      if (!isPublic) {
        // Enable sharing
        const slug = crypto.randomUUID().slice(0, 8);
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { error } = await supabase
          .from("shared_resumes")
          .upsert({
            resume_id: resumeId,
            user_id: user.user.id,
            slug,
            is_active: true,
          }, { onConflict: "resume_id" });

        if (error) throw error;
        setShareSlug(slug);
        setIsPublic(true);
        toast({ title: "Sharing enabled", description: "Your resume is now publicly accessible." });
      } else {
        // Disable sharing
        const { error } = await supabase
          .from("shared_resumes")
          .update({ is_active: false })
          .eq("resume_id", resumeId);

        if (error) throw error;
        setIsPublic(false);
        toast({ title: "Sharing disabled", description: "Your resume is no longer publicly accessible." });
      }
    } catch (error) {
      console.error("Error toggling share:", error);
      toast({ title: "Error", description: "Could not update sharing settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!", description: "The share link has been copied to your clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Share Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Public Link</Label>
              <p className="text-xs text-muted-foreground">Anyone with the link can view your resume</p>
            </div>
            <Switch checked={isPublic} onCheckedChange={toggleSharing} disabled={isLoading} />
          </div>

          {isPublic && shareSlug && (
            <>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="text-xs" />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{viewCount} view{viewCount !== 1 ? "s" : ""}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResumeDialog;
