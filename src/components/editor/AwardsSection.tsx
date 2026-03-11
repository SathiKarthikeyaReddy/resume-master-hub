import { Trophy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award } from "@/types/resume";

interface AwardsSectionProps {
  data: Award[];
  onChange: (data: Award[]) => void;
}

const AwardsSection = ({ data, onChange }: AwardsSectionProps) => {
  const add = () => {
    onChange([...data, { id: crypto.randomUUID(), title: "", issuer: "", date: "", description: "" }]);
  };

  const update = (id: string, field: keyof Award, value: string) => {
    onChange(data.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const remove = (id: string) => {
    onChange(data.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Awards & Honors</h3>
        </div>
        <Button variant="outline" size="sm" onClick={add} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <Trophy className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No awards added yet</p>
          <Button variant="ghost" size="sm" onClick={add} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add an award
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((award, index) => (
            <div key={award.id} className="p-4 border border-border rounded-lg bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Award {index + 1}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(award.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Label className="text-sm text-muted-foreground">Award Title</Label>
                  <Input placeholder="Employee of the Year" value={award.title} onChange={(e) => update(award.id, "title", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Issuer</Label>
                  <Input placeholder="Company Name" value={award.issuer} onChange={(e) => update(award.id, "issuer", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <Input placeholder="2024" value={award.date} onChange={(e) => update(award.id, "date", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Description (optional)</Label>
                  <Input placeholder="Brief description..." value={award.description || ""} onChange={(e) => update(award.id, "description", e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AwardsSection;
