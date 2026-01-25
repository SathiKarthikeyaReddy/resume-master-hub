import { Plus } from "lucide-react";

const CreateResumeCard = () => {
  return (
    <div className="group relative bg-card/50 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 overflow-hidden transition-all duration-300 cursor-pointer hover-lift">
      <div className="aspect-[3/4] flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-foreground mb-1">Create New Resume</h3>
          <p className="text-sm text-muted-foreground">
            Start from scratch or use a template
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateResumeCard;
