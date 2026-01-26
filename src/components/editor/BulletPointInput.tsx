import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BulletPointInputProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

const BulletPointInput = ({ bullets, onChange }: BulletPointInputProps) => {
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
        <div className="space-y-2">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-move flex-shrink-0" />
              <div className="flex items-center gap-1 flex-1">
                <span className="text-muted-foreground text-sm">•</span>
                <Input
                  value={bullet}
                  onChange={(e) => updateBullet(index, e.target.value)}
                  placeholder="Achieved X by doing Y, resulting in Z..."
                  className="h-8 text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => removeBullet(index)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulletPointInput;
