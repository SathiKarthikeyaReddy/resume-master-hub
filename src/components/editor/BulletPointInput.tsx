import { Plus } from "lucide-react";
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
import SortableBulletItem from "./SortableBulletItem";

interface BulletPointInputProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  jobTitle?: string;
  company?: string;
}

const BulletPointInput = ({ bullets, onChange, jobTitle, company }: BulletPointInputProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addBullet = () => {
    onChange([...bullets, ""]);
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onChange(newBullets);
  };

  const removeBullet = (index: number) => {
    onChange(bullets.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = bullets.findIndex((_, i) => `bullet-${i}` === active.id);
      const newIndex = bullets.findIndex((_, i) => `bullet-${i}` === over.id);
      onChange(arrayMove(bullets, oldIndex, newIndex));
    }
  };

  const bulletIds = bullets.map((_, i) => `bullet-${i}`);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Key Responsibilities & Achievements
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addBullet}
          className="h-7 gap-1 text-xs"
        >
          <Plus className="w-3 h-3" />
          Add Bullet
        </Button>
      </div>

      {bullets.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            Add bullet points to highlight your achievements
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addBullet}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add first bullet
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {bullets.map((bullet, index) => (
                <SortableBulletItem
                  key={`bullet-${index}`}
                  id={`bullet-${index}`}
                  bullet={bullet}
                  index={index}
                  jobTitle={jobTitle}
                  company={company}
                  onUpdate={(value) => updateBullet(index, value)}
                  onRemove={() => removeBullet(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default BulletPointInput;
