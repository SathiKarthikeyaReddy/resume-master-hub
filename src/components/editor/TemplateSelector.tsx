import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateType = "classic" | "modern" | "minimal";

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

const templates: { id: TemplateType; name: string; description: string }[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout with serif fonts",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold header with clean sections",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
  },
];

const TemplateSelector = ({ selected, onChange }: TemplateSelectorProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-3">Choose Template</h3>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={cn(
              "relative p-3 rounded-lg border-2 text-left transition-all",
              selected === template.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            {selected === template.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="text-sm font-medium text-foreground">{template.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {template.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
