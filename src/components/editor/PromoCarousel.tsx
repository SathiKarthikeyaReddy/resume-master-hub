import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const defaultPromos: PromoSlide[] = [
  {
    id: "1",
    title: "Premium Templates",
    description: "Unlock 50+ ATS-optimized templates",
    icon: <Crown className="w-5 h-5" />,
    gradient: "from-primary to-emerald-400",
  },
  {
    id: "2",
    title: "AI-Powered Writing",
    description: "Let AI enhance your resume content",
    icon: <Sparkles className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-400",
  },
  {
    id: "3",
    title: "Instant ATS Score",
    description: "Check your resume's ATS compatibility",
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-400",
  },
];

interface PromoCarouselProps {
  slides?: PromoSlide[];
}

const PromoCarousel = ({ slides = defaultPromos }: PromoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`flex-shrink-0 w-full bg-gradient-to-r ${slide.gradient} p-4 rounded-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                {slide.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">
                  {slide.title}
                </h4>
                <p className="text-white/80 text-xs">{slide.description}</p>
              </div>
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
              >
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          onClick={goToPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          onClick={goToNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-3" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
