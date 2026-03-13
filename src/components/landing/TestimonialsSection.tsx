import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "I landed 3 interviews in my first week after rebuilding my resume with this tool. The ATS optimization actually works!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    content: "The AI suggestions saved me hours of writing. My resume went from generic to compelling in 15 minutes.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    content: "Finally, a resume builder that doesn't feel like filling out a tax form. The real-time preview is a game changer.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Data Scientist at Meta",
    content: "The job match analyzer told me exactly what keywords I was missing. Got the interview the next day.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "UX Designer",
    content: "Beautiful templates that actually pass ATS. I've recommended this to my entire design cohort.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Sales Executive",
    content: "The cover letter generator paired with my resume helped me personalize applications at scale. 10/10.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by <span className="gradient-text">Job Seekers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who landed their dream jobs with our resume builder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/50 rounded-2xl p-6 hover-lift"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-primary/20 mb-2" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {testimonial.content}
              </p>
              <div>
                <p className="font-medium text-sm text-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
