import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateType = "classic" | "modern" | "minimal" | "creative" | "executive";

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

const templates: { id: TemplateType; name: string; description: string; color: string }[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif layout",
    color: "bg-gray-600",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold header, clean lines",
    color: "bg-slate-800",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple",
    color: "bg-gray-400",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant purple gradient",
    color: "bg-gradient-to-r from-violet-500 to-indigo-500",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Navy with gold accents",
    color: "bg-slate-900",
  },
];

const TemplateSelector = ({ selected, onChange }: TemplateSelectorProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-3">Choose Template</h3>
      <div className="grid grid-cols-5 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={cn(
              "relative p-2 rounded-lg border-2 text-left transition-all",
              selected === template.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            )}
          >
            {selected === template.id && (
              <div className="absolute top-1 right-1">
                <Check className="w-3 h-3 text-primary" />
              </div>
            )}
            <div className={cn("w-full h-6 rounded mb-2", template.color)} />
            <div className="text-xs font-medium text-foreground truncate">{template.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">
              {template.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
