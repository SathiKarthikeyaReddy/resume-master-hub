import { Award, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Certification } from "@/types/resume";

interface CertificationsSectionProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const CertificationsSection = ({ data, onChange }: CertificationsSectionProps) => {
  const addCertification = () => {
    onChange([...data, {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    }]);
  };

  const update = (id: string, field: keyof Certification, value: string) => {
    onChange(data.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const remove = (id: string) => {
    onChange(data.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Certifications</h3>
        </div>
        <Button variant="outline" size="sm" onClick={addCertification} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <Award className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No certifications added yet</p>
          <Button variant="ghost" size="sm" onClick={addCertification} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add a certification
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((cert, index) => (
            <div key={cert.id} className="p-4 border border-border rounded-lg bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">Certification {index + 1}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Certification Name</Label>
                  <Input placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => update(cert.id, "name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Issuing Organization</Label>
                  <Input placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => update(cert.id, "issuer", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date Earned</Label>
                  <Input placeholder="Jan 2024" value={cert.date} onChange={(e) => update(cert.id, "date", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Expiry Date (optional)</Label>
                  <Input placeholder="Jan 2027" value={cert.expiryDate || ""} onChange={(e) => update(cert.id, "expiryDate", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Credential ID (optional)</Label>
                  <Input placeholder="ABC123XYZ" value={cert.credentialId || ""} onChange={(e) => update(cert.id, "credentialId", e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
