import { FileEdit, Palette, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: FileEdit,
    title: "Fill in Your Details",
    description:
      "Enter your work experience, education, skills, and other relevant information using our intuitive form.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Choose Your Style",
    description:
      "Pick from our collection of ATS-friendly templates and customize colors to match your personal brand.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Apply",
    description:
      "Export your polished resume as a PDF and start applying to your dream jobs with confidence.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Build Your Resume in{" "}
            <span className="gradient-text">Three Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No complicated processes. Just straightforward resume building.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center group">
                {/* Step Number Circle */}
                <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:shadow-glow transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="text-sm font-medium text-primary mb-2">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="xl" asChild>
            <Link to="/dashboard" className="group">
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
