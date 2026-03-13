import { Plus, X, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesSectionProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const ReferencesSection = ({ data, onChange }: ReferencesSectionProps) => {
  const addReference = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        name: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        relationship: "",
      },
    ]);
  };

  const update = (id: string, field: keyof Reference, value: string) => {
    onChange(data.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const remove = (id: string) => {
    onChange(data.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <UserCheck className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">References</h3>
        </div>
        <Button variant="outline" size="sm" onClick={addReference} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <UserCheck className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Add professional references</p>
          <p className="text-xs text-muted-foreground mt-1">Or leave empty to show "Available upon request"</p>
        </div>
      )}

      {data.map((ref) => (
        <div key={ref.id} className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-foreground">Reference</span>
            <Button variant="ghost" size="icon" onClick={() => remove(ref.id)} className="text-destructive h-6 w-6">
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input value={ref.name} onChange={(e) => update(ref.id, "name", e.target.value)} placeholder="Full Name" className="text-sm" />
            <Input value={ref.relationship} onChange={(e) => update(ref.id, "relationship", e.target.value)} placeholder="Relationship (e.g., Manager)" className="text-sm" />
            <Input value={ref.title} onChange={(e) => update(ref.id, "title", e.target.value)} placeholder="Job Title" className="text-sm" />
            <Input value={ref.company} onChange={(e) => update(ref.id, "company", e.target.value)} placeholder="Company" className="text-sm" />
            <Input value={ref.email} onChange={(e) => update(ref.id, "email", e.target.value)} placeholder="Email" className="text-sm" />
            <Input value={ref.phone} onChange={(e) => update(ref.id, "phone", e.target.value)} placeholder="Phone" className="text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferencesSection;
