import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AIAssistant from "./AIAssistant";
import ActionVerbsHelper from "./ActionVerbsHelper";
import { detectWeakOpener } from "@/lib/actionVerbs";

interface SortableBulletItemProps {
  id: string;
  bullet: string;
  index: number;
  jobTitle?: string;
  company?: string;
  onUpdate: (value: string) => void;
  onRemove: () => void;
}

const SortableBulletItem = ({
  id,
  bullet,
  index,
  jobTitle,
  company,
  onUpdate,
  onRemove,
}: SortableBulletItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const weak = detectWeakOpener(bullet);

  const replaceOpener = (verb: string) => {
    const trimmed = bullet.trim();
    if (weak) {
      const rest = trimmed.slice(weak.length).trim();
      onUpdate(`${verb} ${rest}`.trim());
    } else {
      onUpdate(`${verb} ${trimmed}`.trim());
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-1 group"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-muted rounded flex-shrink-0"
        >
          <GripVertical className="w-3 h-3 text-muted-foreground/50" />
        </button>
        <div className="flex items-center gap-1 flex-1">
          <span className="text-muted-foreground text-sm">•</span>
          <Input
            value={bullet}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Achieved X by doing Y, resulting in Z..."
            className="h-8 text-sm"
          />
        </div>
        <ActionVerbsHelper onPick={replaceOpener} />
        <AIAssistant
          type="bullet"
          currentContent={bullet}
          context={{ jobTitle, company }}
          onSuggestion={onUpdate}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={onRemove}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      {weak && (
        <p className="text-[11px] text-orange-500 ml-6">
          Weak opener "{weak}" — try a stronger action verb.
        </p>
      )}
    </div>
  );
};

export default SortableBulletItem;
