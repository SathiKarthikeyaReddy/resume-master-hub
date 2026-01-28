import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkExperience } from "@/types/resume";
import BulletPointInput from "./BulletPointInput";

interface SortableExperienceItemProps {
  experience: WorkExperience;
  index: number;
  onUpdate: (field: keyof WorkExperience, value: string | boolean | string[]) => void;
  onRemove: () => void;
}

const SortableExperienceItem = ({
  experience,
  index,
  onUpdate,
  onRemove,
}: SortableExperienceItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-border rounded-lg bg-card/50 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Experience {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-muted-foreground">Job Title</Label>
          <Input
            placeholder="Software Engineer"
            value={experience.jobTitle}
            onChange={(e) => onUpdate("jobTitle", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Company</Label>
          <Input
            placeholder="Google"
            value={experience.company}
            onChange={(e) => onUpdate("company", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Location</Label>
          <Input
            placeholder="Mountain View, CA"
            value={experience.location}
            onChange={(e) => onUpdate("location", e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground">Start Date</Label>
            <Input
              placeholder="Jan 2020"
              value={experience.startDate}
              onChange={(e) => onUpdate("startDate", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground">End Date</Label>
            <Input
              placeholder="Present"
              value={experience.current ? "Present" : experience.endDate}
              onChange={(e) => onUpdate("endDate", e.target.value)}
              disabled={experience.current}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`current-${experience.id}`}
          checked={experience.current}
          onCheckedChange={(checked) => onUpdate("current", checked as boolean)}
        />
        <Label
          htmlFor={`current-${experience.id}`}
          className="text-sm text-muted-foreground cursor-pointer"
        >
          I currently work here
        </Label>
      </div>

      <BulletPointInput
        bullets={experience.bullets}
        onChange={(bullets) => onUpdate("bullets", bullets)}
        jobTitle={experience.jobTitle}
        company={experience.company}
      />
    </div>
  );
};

export default SortableExperienceItem;
