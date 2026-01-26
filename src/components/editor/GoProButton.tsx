import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoProButtonProps {
  isPro: boolean;
  onToggle: () => void;
}

const GoProButton = ({ isPro, onToggle }: GoProButtonProps) => {
  if (isPro) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
      >
        <Check className="w-4 h-4" />
        Pro Active
      </Button>
    );
  }

  return (
    <Button
      variant="hero"
      size="sm"
      onClick={onToggle}
      className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white"
    >
      <Crown className="w-4 h-4" />
      Go Pro
    </Button>
  );
};

export default GoProButton;
