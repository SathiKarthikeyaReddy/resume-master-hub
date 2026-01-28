import { FileText, MoreVertical, Clock, Trash2, Copy, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResumeCardProps {
  id: string;
  title: string;
  lastEdited: string;
  template?: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

const ResumeCard = ({ id, title, lastEdited, template = "modern", onDelete, onDuplicate }: ResumeCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover-lift hover-glow transition-all duration-300">
      {/* Thumbnail Preview */}
      <Link to={`/editor/${id}`}>
        <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden cursor-pointer">
          <div className="absolute inset-4 bg-background rounded-lg shadow-sm p-4 scale-[0.85] origin-top">
            {/* Mini Resume Preview */}
            <div className="space-y-3">
              <div className="h-3 bg-primary/30 rounded w-1/2" />
              <div className="h-2 bg-muted rounded w-1/3" />
              <div className="border-t border-border/50 my-3" />
              <div className="space-y-1.5">
                <div className="h-1.5 bg-muted rounded w-full" />
                <div className="h-1.5 bg-muted rounded w-4/5" />
                <div className="h-1.5 bg-muted rounded w-3/5" />
              </div>
              <div className="border-t border-border/50 my-3" />
              <div className="space-y-1.5">
                <div className="h-1.5 bg-muted rounded w-full" />
                <div className="h-1.5 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="hero" size="sm">
              Edit Resume
            </Button>
          </div>
        </div>
      </Link>

      {/* Card Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{lastEdited}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/editor/${id}`} className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    onDuplicate();
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
