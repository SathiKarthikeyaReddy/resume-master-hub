import { useState, useEffect } from "react";
import { Plus, Briefcase, Trash2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Status = "saved" | "applied" | "interviewing" | "offer" | "rejected";

interface Application {
  id: string;
  company: string;
  role: string;
  location: string | null;
  url: string | null;
  status: Status;
  applied_date: string | null;
  salary: string | null;
  notes: string | null;
}

const STATUSES: { key: Status; label: string; color: string }[] = [
  { key: "saved", label: "Saved", color: "bg-slate-500/10 text-slate-700 border-slate-500/30" },
  { key: "applied", label: "Applied", color: "bg-blue-500/10 text-blue-700 border-blue-500/30" },
  { key: "interviewing", label: "Interviewing", color: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  { key: "offer", label: "Offer", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  { key: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-700 border-rose-500/30" },
];

const JobTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", location: "", url: "", status: "saved" as Status, applied_date: "", salary: "", notes: "" });

  useEffect(() => { if (user) fetchApps(); }, [user]);

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error loading", description: error.message, variant: "destructive" });
    else setApps((data || []) as Application[]);
    setLoading(false);
  };

  const addApp = async () => {
    if (!user || !form.company.trim() || !form.role.trim()) {
      toast({ title: "Required fields", description: "Company and role are required.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim() || null,
      url: form.url.trim() || null,
      status: form.status,
      applied_date: form.applied_date || null,
      salary: form.salary.trim() || null,
      notes: form.notes.trim() || null,
    }).select().single();
    if (error) {
      toast({ title: "Could not add", description: error.message, variant: "destructive" });
      return;
    }
    setApps([data as Application, ...apps]);
    setForm({ company: "", role: "", location: "", url: "", status: "saved", applied_date: "", salary: "", notes: "" });
    setOpen(false);
    toast({ title: "Application added" });
  };

  const updateStatus = async (id: string, status: Status) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await supabase.from("job_applications").update({ status }).eq("id", id);
  };

  const deleteApp = async (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("job_applications").delete().eq("id", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1 flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-primary" />
                Job Application Tracker
              </h1>
              <p className="text-muted-foreground">Keep every application organized in one place.</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2"><Plus className="w-4 h-4" />Add Application</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>New Application</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Company *</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
                    <div><Label>Role *</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                    <div>
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Applied Date</Label><Input type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} /></div>
                    <div><Label>Salary (optional)</Label><Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$120k" /></div>
                  </div>
                  <div><Label>Job URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
                  <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
                </div>
                <DialogFooter><Button onClick={addApp} variant="hero" className="w-full">Add Application</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground animate-pulse">Loading...</div>
          ) : apps.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium text-foreground mb-1">No applications yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Track every job you apply to in one place.</p>
              <Button onClick={() => setOpen(true)} variant="hero">Add your first application</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {STATUSES.map((s) => {
                const items = apps.filter((a) => a.status === s.key);
                return (
                  <div key={s.key} className="bg-card/50 rounded-xl p-3 border border-border/50">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="font-semibold text-sm text-foreground">{s.label}</h3>
                      <Badge variant="outline" className="text-xs">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((a) => (
                        <div key={a.id} className={`p-3 rounded-lg border ${s.color} bg-card`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-foreground truncate">{a.role}</div>
                              <div className="text-xs text-muted-foreground truncate">{a.company}</div>
                              {a.location && <div className="text-xs text-muted-foreground/70 truncate">{a.location}</div>}
                              {a.applied_date && <div className="text-xs text-muted-foreground/70 mt-1">{new Date(a.applied_date).toLocaleDateString()}</div>}
                            </div>
                            <div className="flex flex-col gap-1">
                              {a.url && (
                                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button onClick={() => deleteApp(a.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as Status)}>
                            <SelectTrigger className="h-7 mt-2 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((st) => <SelectItem key={st.key} value={st.key}>{st.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobTracker;
