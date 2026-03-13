import { useState } from "react";
import { BookOpen, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bulletLibrary: Record<string, string[]> = {
  "Software Engineer": [
    "Developed and maintained scalable web applications serving 100K+ daily active users",
    "Reduced page load time by 40% through code optimization and caching strategies",
    "Led migration from monolithic architecture to microservices, improving deployment frequency by 3x",
    "Implemented CI/CD pipeline reducing deployment time from hours to minutes",
    "Mentored 5 junior developers, conducting code reviews and pair programming sessions",
    "Built RESTful APIs handling 10M+ requests per day with 99.9% uptime",
  ],
  "Product Manager": [
    "Defined product roadmap and prioritized features based on customer research and business impact",
    "Launched 3 major product features resulting in 25% increase in user engagement",
    "Conducted user interviews with 50+ customers to identify pain points and opportunities",
    "Managed cross-functional team of 12 engineers, designers, and analysts",
    "Increased conversion rate by 15% through A/B testing and data-driven iteration",
    "Reduced customer churn by 20% by implementing proactive engagement features",
  ],
  "Marketing Manager": [
    "Developed and executed multi-channel marketing campaigns generating $2M+ in pipeline",
    "Grew organic search traffic by 150% through SEO strategy and content optimization",
    "Managed $500K annual advertising budget across Google, Facebook, and LinkedIn",
    "Increased email open rates by 35% through segmentation and personalization strategies",
    "Led rebranding initiative resulting in 40% improvement in brand awareness metrics",
    "Built and managed team of 5 marketing specialists and 3 freelance contractors",
  ],
  "Data Analyst": [
    "Analyzed large datasets (10M+ rows) to identify trends and provide actionable business insights",
    "Built automated reporting dashboards reducing manual reporting time by 80%",
    "Developed predictive models improving forecast accuracy by 25%",
    "Created data visualization reports for C-suite executives to support strategic decisions",
    "Designed and implemented ETL pipelines processing 5TB of data daily",
    "Conducted A/B test analysis for product features, driving data-informed decisions",
  ],
  "Project Manager": [
    "Managed portfolio of 8 concurrent projects with combined budget of $3M",
    "Delivered projects 15% under budget while maintaining quality standards",
    "Coordinated cross-functional teams of 20+ members across 3 time zones",
    "Implemented Agile methodology reducing project delivery time by 30%",
    "Created project documentation, risk assessments, and stakeholder communication plans",
    "Achieved 95% on-time delivery rate across all managed projects",
  ],
  "Sales Representative": [
    "Exceeded quarterly sales quota by 120%, generating $1.5M in revenue",
    "Built and maintained pipeline of 200+ qualified prospects through cold outreach",
    "Closed enterprise deals averaging $150K ARR with Fortune 500 companies",
    "Reduced sales cycle length by 25% through improved qualification process",
    "Trained 8 new sales representatives on product knowledge and sales methodology",
    "Achieved highest customer satisfaction score (4.9/5) among team of 15 reps",
  ],
  "Designer": [
    "Designed user interfaces for web and mobile applications used by 500K+ users",
    "Conducted usability testing sessions resulting in 40% improvement in task completion rates",
    "Created design system with 200+ reusable components, improving team efficiency by 50%",
    "Led redesign of flagship product increasing user satisfaction scores by 30%",
    "Collaborated with engineering teams to ensure pixel-perfect implementation",
    "Produced wireframes, prototypes, and high-fidelity mockups for 15+ product features",
  ],
  "Customer Success": [
    "Managed portfolio of 50 enterprise accounts totaling $5M in ARR",
    "Achieved 95% customer retention rate, exceeding team target by 10%",
    "Increased upsell revenue by 30% through proactive account management",
    "Conducted quarterly business reviews driving product adoption and satisfaction",
    "Reduced time-to-value for new customers by 40% through improved onboarding process",
    "Resolved escalated customer issues maintaining NPS score above 70",
  ],
};

interface PreWrittenBulletsProps {
  onSelect: (bullet: string) => void;
}

const PreWrittenBullets = ({ onSelect }: PreWrittenBulletsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const roles = Object.keys(bulletLibrary);
  const bullets = selectedRole ? bulletLibrary[selectedRole] || [] : [];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <BookOpen className="w-3 h-3" />
          Pre-written Bullets
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select a job role..." />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role} className="text-xs">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {bullets.length > 0 && (
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {bullets.map((bullet, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(bullet)}
                className="w-full text-left text-xs p-2 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors flex items-start gap-2"
              >
                <Plus className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{bullet}</span>
              </button>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PreWrittenBullets;
