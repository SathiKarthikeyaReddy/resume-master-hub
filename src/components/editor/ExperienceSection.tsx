import { Briefcase, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { WorkExperience } from "@/types/resume";
import SortableExperienceItem from "./SortableExperienceItem";

interface ExperienceSectionProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const ExperienceSection = ({ data, onChange }: ExperienceSectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [],
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean | string[]
  ) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);
      onChange(arrayMove(data, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Work Experience</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addExperience}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            No work experience added yet
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={addExperience}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add your first experience
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((exp) => exp.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.map((exp, index) => (
                <SortableExperienceItem
                  key={exp.id}
                  experience={exp}
                  index={index}
                  onUpdate={(field, value) => updateExperience(exp.id, field, value)}
                  onRemove={() => removeExperience(exp.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ExperienceSection;
