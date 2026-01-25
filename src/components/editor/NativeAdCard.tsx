import { ExternalLink, Megaphone } from "lucide-react";

interface NativeAdCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  onClick?: () => void;
}

const NativeAdCard = ({
  title = "Boost Your Career",
  description = "Get personalized career coaching and interview prep from industry experts.",
  imageUrl,
  ctaText = "Learn More",
  onClick,
}: NativeAdCardProps) => {
  return (
    <div className="my-6 p-4 bg-muted/50 rounded-xl border border-border/50 relative overflow-hidden">
      {/* Ad label */}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
        <Megaphone className="w-3 h-3" />
        <span>Sponsored</span>
      </div>

      <div className="flex items-start gap-4">
        {/* Image placeholder */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm mb-1 pr-16">
            {title}
          </h4>
          <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
            {description}
          </p>
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {ctaText}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NativeAdCard;
