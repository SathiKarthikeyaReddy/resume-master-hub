import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ACTION_VERBS } from "@/lib/actionVerbs";

interface ActionVerbsHelperProps {
  onPick: (verb: string) => void;
}

const ActionVerbsHelper = ({ onPick }: ActionVerbsHelperProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2">
          <Wand2 className="w-3 h-3" /> Action verbs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="start">
        <div className="space-y-3">
          {Object.entries(ACTION_VERBS).map(([category, verbs]) => (
            <div key={category}>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                {category}
              </h5>
              <div className="flex flex-wrap gap-1">
                {verbs.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { onPick(v); setOpen(false); }}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionVerbsHelper;
