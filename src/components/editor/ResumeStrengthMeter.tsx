import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeStrengthMeterProps {
  percentage: number;
  label: string;
  completedSections: string[];
  missingSections: string[];
}

const ResumeStrengthMeter = ({
  percentage,
  label,
  completedSections,
  missingSections,
}: ResumeStrengthMeterProps) => {
  const getColorClass = () => {
    if (percentage >= 80) return "text-primary";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 40) return "text-orange-500";
    return "text-destructive";
  };

  const getProgressClass = () => {
    if (percentage >= 80) return "[&>div]:bg-primary";
    if (percentage >= 60) return "[&>div]:bg-yellow-500";
    if (percentage >= 40) return "[&>div]:bg-orange-500";
    return "[&>div]:bg-destructive";
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={cn("w-5 h-5", getColorClass())} />
          <span className="font-semibold text-foreground">Resume Strength</span>
        </div>
        <span className={cn("text-sm font-medium", getColorClass())}>
          {percentage}% - {label}
        </span>
      </div>

      <Progress value={percentage} className={cn("h-2", getProgressClass())} />

      <div className="flex flex-wrap gap-2 text-xs">
        {completedSections.map((section) => (
          <span
            key={section}
            className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full"
          >
            <CheckCircle2 className="w-3 h-3" />
            {section}
          </span>
        ))}
        {missingSections.map((section) => (
          <span
            key={section}
            className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-full"
          >
            <Circle className="w-3 h-3" />
            {section}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumeStrengthMeter;
