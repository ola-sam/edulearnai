import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface Source {
  id: number;
  title: string;
  grade: number;
  subject: string;
  documentType: string;
}

interface ChatMessage {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  subject: string | null;
  sources?: Source[];
}

interface UseAiTutorProps {
  enabled?: boolean;
}

interface SendMessageParams {
  message: string;
  subject: string;
}

export function useAiTutor({ enabled = true }: UseAiTutorProps = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history
  const {
    data: chatHistory,
    isLoading: isLoadingChat,
    error: chatError,
    refetch: refetchChatHistory
  } = useQuery({
    queryKey: ['/api/users', user?.id, 'chat-history'],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/users/${user.id}/chat-history`);
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return response.json() as Promise<ChatMessage[]>;
    },
    enabled: !!user && enabled,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async ({ message, subject }: SendMessageParams) => {
      if (!user) throw new Error('User not logged in');
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/tutor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            message,
            subject
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        
        return response.json();
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'chat-history'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message to AI tutor. Please try again.',
        variant: 'destructive'
      });
      console.error('Error sending message:', error);
    }
  });

  return {
    chatHistory: chatHistory || [],
    isLoadingChat,
    chatError,
    isLoading,
    sendMessage: sendMessage.mutateAsync,
    refetchChatHistory
  };
}