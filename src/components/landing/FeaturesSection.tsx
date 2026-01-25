import { Eye, Zap, Download, Palette, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Real-time Preview",
    description:
      "See your changes instantly as you type. No more guessing how your resume will look.",
  },
  {
    icon: Zap,
    title: "ATS-Optimized",
    description:
      "Our templates are designed to pass through Applicant Tracking Systems with ease.",
  },
  {
    icon: Download,
    title: "Free PDF Export",
    description:
      "Download your resume as a perfectly formatted PDF, ready to send to employers.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from professionally designed templates that make your resume stand out.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays on your device. We don't store or share your personal information.",
  },
  {
    icon: Clock,
    title: "Save Your Progress",
    description:
      "Create multiple versions and pick up right where you left off anytime.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Land the Job</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that make building your resume fast, easy, and
            effective.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 border border-border/50 hover-lift hover-glow transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
