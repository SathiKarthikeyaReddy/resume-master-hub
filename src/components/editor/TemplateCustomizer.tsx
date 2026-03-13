import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface TemplateCustomization {
  primaryColor: string;
  fontFamily: "serif" | "sans-serif" | "mono";
  fontSize: "small" | "medium" | "large";
  lineSpacing: "compact" | "normal" | "relaxed";
  showPhoto: boolean;
}

export const defaultCustomization: TemplateCustomization = {
  primaryColor: "#0f766e",
  fontFamily: "serif",
  fontSize: "medium",
  lineSpacing: "normal",
  showPhoto: false,
};

const presetColors = [
  { name: "Teal", value: "#0f766e" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Burgundy", value: "#7f1d1d" },
  { name: "Forest", value: "#14532d" },
  { name: "Slate", value: "#334155" },
  { name: "Indigo", value: "#3730a3" },
  { name: "Rose", value: "#9f1239" },
  { name: "Amber", value: "#92400e" },
];

interface TemplateCustomizerProps {
  customization: TemplateCustomization;
  onChange: (customization: TemplateCustomization) => void;
}

const TemplateCustomizer = ({ customization, onChange }: TemplateCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const update = <K extends keyof TemplateCustomization>(key: K, value: TemplateCustomization[K]) => {
    onChange({ ...customization, [key]: value });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-sm w-full justify-between px-0 hover:bg-transparent">
          <span className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Customize Template
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-3">
        {/* Color */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Accent Color</Label>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color.value}
                title={color.name}
                onClick={() => update("primaryColor", color.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  customization.primaryColor === color.value
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
            <div className="relative">
              <Input
                type="color"
                value={customization.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="w-7 h-7 p-0 border-0 cursor-pointer rounded-full overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* Font */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Font</Label>
            <Select value={customization.fontFamily} onValueChange={(v) => update("fontFamily", v as TemplateCustomization["fontFamily"])}>
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">Serif (Classic)</SelectItem>
                <SelectItem value="sans-serif">Sans-serif (Modern)</SelectItem>
                <SelectItem value="mono">Monospace (Tech)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <Select value={customization.fontSize} onValueChange={(v) => update("fontSize", v as TemplateCustomization["fontSize"])}>
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <Label className="text-xs text-muted-foreground">Line Spacing</Label>
          <Select value={customization.lineSpacing} onValueChange={(v) => update("lineSpacing", v as TemplateCustomization["lineSpacing"])}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="relaxed">Relaxed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TemplateCustomizer;
