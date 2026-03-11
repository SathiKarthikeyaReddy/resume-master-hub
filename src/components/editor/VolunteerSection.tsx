import { Heart, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VolunteerExperience } from "@/types/resume";

interface VolunteerSectionProps {
  data: VolunteerExperience[];
  onChange: (data: VolunteerExperience[]) => void;
}

const VolunteerSection = ({ data, onChange }: VolunteerSectionProps) => {
  const add = () => {
    onChange([...data, {
      id: crypto.randomUUID(),
      role: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }]);
  };

  const update = (id: string, field: keyof VolunteerExperience, value: string | boolean) => {
    onChange(data.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const remove = (id: string) => {
    onChange(data.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Volunteer Experience</h3>
        </div>
        <Button variant="outline" size="sm" onClick={add} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <Heart className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No volunteer experience added yet</p>
          <Button variant="ghost" size="sm" onClick={add} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add volunteer experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((vol, index) => (
            <div key={vol.id} className="p-4 border border-border rounded-lg bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">Volunteer {index + 1}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(vol.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Role</Label>
                  <Input placeholder="Volunteer Coordinator" value={vol.role} onChange={(e) => update(vol.id, "role", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Organization</Label>
                  <Input placeholder="Red Cross" value={vol.organization} onChange={(e) => update(vol.id, "organization", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <Input placeholder="New York, NY" value={vol.location} onChange={(e) => update(vol.id, "location", e.target.value)} className="mt-1" />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Start Date</Label>
                    <Input placeholder="Jan 2023" value={vol.startDate} onChange={(e) => update(vol.id, "startDate", e.target.value)} className="mt-1" />
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Checkbox checked={vol.current} onCheckedChange={(checked) => update(vol.id, "current", !!checked)} id={`vol-current-${vol.id}`} />
                    <Label htmlFor={`vol-current-${vol.id}`} className="text-xs text-muted-foreground">Current</Label>
                  </div>
                </div>
                {!vol.current && (
                  <div>
                    <Label className="text-sm text-muted-foreground">End Date</Label>
                    <Input placeholder="Dec 2023" value={vol.endDate} onChange={(e) => update(vol.id, "endDate", e.target.value)} className="mt-1" />
                  </div>
                )}
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <Textarea placeholder="Describe your contributions..." value={vol.description} onChange={(e) => update(vol.id, "description", e.target.value)} className="mt-1 min-h-[80px] resize-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerSection;
