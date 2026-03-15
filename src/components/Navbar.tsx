import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import SaveIndicator from "@/components/SaveIndicator";
import { SaveStatus } from "@/hooks/useResumeAutoSave";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  saveStatus?: SaveStatus;
}

const Navbar = ({ saveStatus }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isEditor = location.pathname.startsWith("/editor");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              ATS-Master
            </span>
          </Link>

          {/* Center - Save Status (only on editor) */}
          {isEditor && saveStatus && (
            <div className="hidden md:flex items-center">
              <SaveIndicator status={saveStatus} />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding && !user ? (
              <>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              </>
            ) : user ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/settings" className="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
              </>
            ) : null}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isEditor && saveStatus && (
              <div className="md:hidden">
                <SaveIndicator status={saveStatus} />
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {isEditor ? (
                    <Button variant="hero-outline" asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button variant="hero" asChild>
                      <Link to="/editor">New Resume</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to="/auth">Get Started Free</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-3">
              {user ? (
                <div className="px-4 flex flex-col gap-2">
                  <Button variant="hero" asChild className="w-full">
                    <Link to="/editor" onClick={() => setIsMenuOpen(false)}>New Resume</Link>
                  </Button>
                  <Button variant="hero-outline" asChild className="w-full">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  {isLanding && (
                    <>
                      <a href="#features" className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
                      <a href="#how-it-works" className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
                    </>
                  )}
                  <div className="px-4 pt-2 flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full">
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button variant="hero" asChild className="w-full">
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Get Started Free</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
