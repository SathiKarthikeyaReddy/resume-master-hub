import { GripVertical } from "lucide-react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResumeSectionKey } from "@/types/resume";
import { cn } from "@/lib/utils";

const sectionLabels: Record<ResumeSectionKey, string> = {
  personalInfo: "Personal Info",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  languages: "Languages",
  volunteer: "Volunteer",
  awards: "Awards",
};

interface SortableSectionItemProps {
  id: ResumeSectionKey;
}

const SortableSectionItem = ({ id }: SortableSectionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-foreground cursor-grab",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground shrink-0" {...attributes} {...listeners} />
      {sectionLabels[id]}
    </div>
  );
};

interface SectionReorderProps {
  order: ResumeSectionKey[];
  onChange: (order: ResumeSectionKey[]) => void;
}

const SectionReorder = ({ order, onChange }: SectionReorderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as ResumeSectionKey);
      const newIndex = order.indexOf(over.id as ResumeSectionKey);
      onChange(arrayMove(order, oldIndex, newIndex));
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-2">Section Order</h3>
      <p className="text-xs text-muted-foreground mb-3">Drag to reorder sections on your resume</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {order.map((key) => (
              <SortableSectionItem key={key} id={key} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SectionReorder;
