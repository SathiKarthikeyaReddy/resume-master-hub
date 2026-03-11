import { Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/types/resume";

interface LanguagesSectionProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const proficiencyLabels: Record<Language["proficiency"], string> = {
  native: "Native / Bilingual",
  fluent: "Fluent",
  advanced: "Advanced",
  intermediate: "Intermediate",
  beginner: "Beginner",
};

const LanguagesSection = ({ data, onChange }: LanguagesSectionProps) => {
  const addLanguage = () => {
    onChange([...data, { id: crypto.randomUUID(), name: "", proficiency: "intermediate" }]);
  };

  const update = (id: string, field: keyof Language, value: string) => {
    onChange(data.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const remove = (id: string) => {
    onChange(data.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Languages</h3>
        </div>
        <Button variant="outline" size="sm" onClick={addLanguage} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <Globe className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No languages added yet</p>
          <Button variant="ghost" size="sm" onClick={addLanguage} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add a language
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card/50">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Language</Label>
                  <Input placeholder="English" value={lang.name} onChange={(e) => update(lang.id, "name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Proficiency</Label>
                  <Select value={lang.proficiency} onValueChange={(v) => update(lang.id, "proficiency", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(proficiencyLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => remove(lang.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguagesSection;
