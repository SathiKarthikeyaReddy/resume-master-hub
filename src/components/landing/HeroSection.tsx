import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const benefits = [
    "ATS-Optimized Templates",
    "Real-time Preview",
    "Free PDF Export",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 text-secondary-foreground text-sm font-medium mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span>Build Your Perfect Resume</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up-delay-1">
            Create an{" "}
            <span className="gradient-text">ATS-Friendly</span>
            <br />
            Resume in Minutes
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up-delay-2">
            Land more interviews with professionally designed templates that pass
            Applicant Tracking Systems. Build, customize, and export your resume
            for free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up-delay-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard" className="group">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#features">See Features</a>
            </Button>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-up-delay-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Image Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto animate-scale-in">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10 pointer-events-none" />
            <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 p-8 w-full max-w-4xl">
                {/* Mock Resume Preview */}
                <div className="bg-background rounded-lg shadow-card p-6 space-y-4">
                  <div className="h-4 bg-primary/20 rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="space-y-2 mt-6">
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-4/5" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-5/6" />
                  </div>
                </div>
                {/* Mock Editor Preview */}
                <div className="bg-background rounded-lg shadow-card p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-8 bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
