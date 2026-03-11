import { useState, useEffect } from "react";
import { User, Mail, Save, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (data) {
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    }
    setIsLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    }
    setIsSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password reset email sent", description: "Check your email for the reset link." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="animate-pulse text-muted-foreground text-center">Loading settings...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your profile and account preferences.</p>

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </h2>

              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user?.email}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
                <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="mt-1" />
              </div>

              <Button onClick={saveProfile} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </Button>
            </div>

            {/* Security Section */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Change your password by requesting a reset email.</p>
              <Button variant="outline" onClick={handlePasswordReset}>
                Send Password Reset Email
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
