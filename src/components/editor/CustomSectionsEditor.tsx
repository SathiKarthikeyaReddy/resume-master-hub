import { useState } from "react";
import { Plus, X, GripVertical, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; heading: string; subheading: string; description: string }[];
}

interface CustomSectionsEditorProps {
  sections: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
}

const CustomSectionsEditor = ({ sections, onChange }: CustomSectionsEditorProps) => {
  const addSection = () => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title: "Custom Section",
      items: [],
    };
    onChange([...sections, newSection]);
  };

  const updateSection = (id: string, field: keyof CustomSection, value: unknown) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const addItem = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newItem = { id: crypto.randomUUID(), heading: "", subheading: "", description: "" };
    updateSection(sectionId, "items", [...section.items, newItem]);
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const updatedItems = section.items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSection(sectionId, "items", updatedItems);
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    updateSection(sectionId, "items", section.items.filter((item) => item.id !== itemId));
  };

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <LayoutList className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Custom Sections</h3>
        </div>
        <Button variant="outline" size="sm" onClick={addSection} className="gap-1">
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <LayoutList className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            Add custom sections like References, Publications, or Hobbies
          </p>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.id} className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
          <div className="flex items-center gap-2">
            <Input
              value={section.title}
              onChange={(e) => updateSection(section.id, "title", e.target.value)}
              placeholder="Section Title"
              className="font-medium"
            />
            <Button variant="ghost" size="icon" onClick={() => removeSection(section.id)} className="shrink-0 text-destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {section.items.map((item) => (
            <div key={item.id} className="bg-card rounded-lg p-3 space-y-2 border border-border/50">
              <div className="flex gap-2">
                <Input
                  value={item.heading}
                  onChange={(e) => updateItem(section.id, item.id, "heading", e.target.value)}
                  placeholder="Heading (e.g., Title, Name)"
                  className="text-sm"
                />
                <Button variant="ghost" size="icon" onClick={() => removeItem(section.id, item.id)} className="shrink-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <Input
                value={item.subheading}
                onChange={(e) => updateItem(section.id, item.id, "subheading", e.target.value)}
                placeholder="Subheading (optional)"
                className="text-sm"
              />
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(section.id, item.id, "description", e.target.value)}
                placeholder="Description (optional)"
                className="text-sm min-h-[60px]"
              />
            </div>
          ))}

          <Button variant="ghost" size="sm" onClick={() => addItem(section.id)} className="gap-1 text-xs">
            <Plus className="w-3 h-3" />
            Add Entry
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomSectionsEditor;
