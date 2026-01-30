import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Collaborator {
  id: string;
  email: string;
  name: string;
  color: string;
  lastSeen: string;
}

interface CollaboratorPresenceProps {
  collaborators: Collaborator[];
  isConnected: boolean;
}

const CollaboratorPresence = ({ collaborators, isConnected }: CollaboratorPresenceProps) => {
  if (!isConnected) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        Connecting...
      </div>
    );
  }

  if (collaborators.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        Only you
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Users className="w-3 h-3" />
          {collaborators.length + 1} editing
        </Badge>
        
        <div className="flex -space-x-2">
          {collaborators.slice(0, 5).map((collab) => (
            <Tooltip key={collab.id}>
              <TooltipTrigger asChild>
                <Avatar className="w-7 h-7 border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110">
                  <AvatarFallback
                    style={{ backgroundColor: collab.color }}
                    className="text-white text-xs font-medium"
                  >
                    {collab.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{collab.name}</p>
                <p className="text-xs text-muted-foreground">{collab.email}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {collaborators.length > 5 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-7 h-7 border-2 border-background cursor-pointer">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    +{collaborators.length - 5}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{collaborators.length - 5} more collaborators</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CollaboratorPresence;
