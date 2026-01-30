import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Collaborator {
  id: string;
  email: string;
  name: string;
  color: string;
  lastSeen: string;
}

interface UseResumeCollaborationProps {
  resumeId: string | null;
  resumeData: ResumeData;
  onRemoteUpdate: (data: ResumeData) => void;
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const useResumeCollaboration = ({
  resumeId,
  resumeData,
  onRemoteUpdate,
}: UseResumeCollaborationProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!resumeId) return;

    let presenceChannel: RealtimeChannel;

    const setupCollaboration = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userInfo = {
        id: user.id,
        email: user.email || "Unknown",
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
        color: getRandomColor(),
        lastSeen: new Date().toISOString(),
      };

      // Create a presence channel for this resume
      presenceChannel = supabase.channel(`resume:${resumeId}`, {
        config: {
          presence: { key: user.id },
        },
      });

      // Listen for presence changes
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();
          const users = Object.values(state)
            .flat()
            .map((p: unknown) => p as Collaborator)
            .filter((p) => p.id !== user.id);
          setCollaborators(users);
        })
        .on("presence", { event: "join" }, ({ newPresences }) => {
          console.log("User joined:", newPresences);
        })
        .on("presence", { event: "leave" }, ({ leftPresences }) => {
          console.log("User left:", leftPresences);
        });

      // Listen for broadcast messages (real-time content updates)
      presenceChannel.on("broadcast", { event: "content-update" }, ({ payload }) => {
        if (payload.userId !== user.id && payload.content) {
          onRemoteUpdate(payload.content);
        }
      });

      // Subscribe and track presence
      await presenceChannel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track(userInfo);
          setIsConnected(true);
        }
      });

      setChannel(presenceChannel);
    };

    setupCollaboration();

    return () => {
      if (presenceChannel) {
        presenceChannel.unsubscribe();
      }
    };
  }, [resumeId]);

  // Broadcast content changes to other collaborators
  const broadcastUpdate = useCallback((content: ResumeData) => {
    if (!channel || !isConnected) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      
      channel.send({
        type: "broadcast",
        event: "content-update",
        payload: {
          userId: user.id,
          content,
          timestamp: new Date().toISOString(),
        },
      });
    });
  }, [channel, isConnected]);

  return {
    collaborators,
    isConnected,
    broadcastUpdate,
  };
};
