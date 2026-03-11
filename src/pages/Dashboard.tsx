import { useState, useEffect } from "react";
import { Search, Filter, LayoutGrid, List, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResumeCard from "@/components/dashboard/ResumeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
  content: unknown;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "name">("updated");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at, content")
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading resumes", description: "Please try again later.", variant: "destructive" });
    } else {
      setResumes(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("resumes").delete().eq("id", deleteTarget);
    if (error) {
      toast({ title: "Error deleting resume", description: "Could not delete.", variant: "destructive" });
    } else {
      setResumes(resumes.filter((r) => r.id !== deleteTarget));
      toast({ title: "Resume deleted", description: "Your resume has been deleted." });
    }
    setDeleteTarget(null);
  };

  const handleDuplicate = async (id: string) => {
    const resumeToDuplicate = resumes.find((r) => r.id === id);
    if (!resumeToDuplicate || !user) return;

    const { data, error } = await supabase
      .from("resumes")
      .insert([{ user_id: user.id, title: `${resumeToDuplicate.title} (Copy)`, content: JSON.parse(JSON.stringify(resumeToDuplicate.content)) }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error duplicating resume", description: "Could not duplicate.", variant: "destructive" });
    } else {
      setResumes([data, ...resumes]);
      toast({ title: "Resume duplicated", description: "Your resume has been copied." });
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from("resumes")
      .update({ title: newTitle })
      .eq("id", id);

    if (error) {
      toast({ title: "Error renaming resume", description: "Could not rename.", variant: "destructive" });
    } else {
      setResumes(resumes.map((r) => r.id === id ? { ...r, title: newTitle } : r));
      toast({ title: "Resume renamed", description: "Title updated successfully." });
    }
  };

  const formatLastEdited = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filteredResumes = resumes
    .filter((resume) => resume.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Resumes</h1>
            <p className="text-muted-foreground">Create, edit, and manage all your resumes in one place.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-up-delay-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search resumes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border/50" />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "updated" | "name")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse text-muted-foreground">Loading your resumes...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up-delay-2">
              <Link to="/editor">
                <div className="group relative bg-card/50 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 overflow-hidden transition-all duration-300 cursor-pointer hover-lift">
                  <div className="aspect-[3/4] flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-foreground mb-1">Create New Resume</h3>
                      <p className="text-sm text-muted-foreground">Start from scratch</p>
                    </div>
                  </div>
                </div>
              </Link>

              {filteredResumes.map((resume) => {
                const content = resume.content as { template?: string } | null;
                return (
                  <ResumeCard
                    key={resume.id}
                    id={resume.id}
                    title={resume.title}
                    lastEdited={formatLastEdited(resume.updated_at)}
                    template={content?.template || "classic"}
                    onDelete={() => setDeleteTarget(resume.id)}
                    onDuplicate={() => handleDuplicate(resume.id)}
                    onRename={(newTitle) => handleRename(resume.id, newTitle)}
                  />
                );
              })}
            </div>
          )}

          {!isLoading && filteredResumes.length === 0 && resumes.length > 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium text-foreground mb-2">No matching resumes</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          )}

          {!isLoading && resumes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">Create your first resume and start landing more interviews!</p>
              <Button variant="hero" asChild>
                <Link to="/editor">Create Your First Resume</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
