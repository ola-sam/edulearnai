import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogBody
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { getInitials } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type ChatMessage = {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  subject: string | null;
};

type AiChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AI_INITIAL_MESSAGE = `Hi there! I'm your AI learning assistant. How can I help you today?`;

const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
  'General'
];

const AiChatModal = ({ isOpen, onClose }: AiChatModalProps) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState<string>('General');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch chat history when modal is opened
  const { data: chatHistory, isLoading: isLoadingChat } = useQuery({
    queryKey: ['/api/users', user?.id, 'chat-history'],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/users/${user.id}/chat-history`);
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return response.json();
    },
    enabled: !!user && isOpen,
  });

  // AI Chat mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { userId: number; message: string; subject: string }) => {
      const response = await apiRequest('/api/ai/tutor', {
        method: 'POST',
        data: messageData
      });
      return response;
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

  // Initialize with chat history or welcome message
  useEffect(() => {
    if (isOpen && chatHistory) {
      if (chatHistory.length > 0) {
        setMessages(chatHistory);
      } else {
        // No chat history, show welcome message
        setMessages([{
          id: 0,
          userId: user?.id || 0,
          content: AI_INITIAL_MESSAGE,
          timestamp: new Date(),
          role: 'assistant',
          subject: null
        }]);
      }
    }
    
    // Focus input when opened
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, chatHistory, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !user) return;
    setIsLoading(true);

    try {
      await sendMessageMutation.mutateAsync({
        userId: user.id,
        message: inputValue,
        subject
      });
      
      setInputValue('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }

    // Simple AI response logic (with some rules for educational context)
    setTimeout(() => {
      let aiResponse: string;
      
      const lowercaseInput = inputValue.toLowerCase();
      if (lowercaseInput.includes('multiplication') || lowercaseInput.includes('math')) {
        aiResponse = `I can help with that! Let's start with a simple approach to learning multiplication tables. Would you like me to:
        
- Show you some quick tricks for multiplication?
- Start a practice quiz with easy questions?
- Recommend a fun game to learn multiplication?`;
      } else if (lowercaseInput.includes('english') || lowercaseInput.includes('reading') || lowercaseInput.includes('writing')) {
        aiResponse = `I'd be happy to help you with English! Here are some options:

- Practice reading comprehension with a short story
- Learn about grammar rules with interactive examples
- Improve your vocabulary with word games`;
      } else if (lowercaseInput.includes('science')) {
        aiResponse = `Science is fascinating! I can help you with:

- Understanding basic scientific concepts
- Exploring interesting science facts
- Learning about experiments you can do at home`;
      } else if (lowercaseInput.includes('help')) {
        aiResponse = `I'm here to assist with your learning journey! I can:

- Answer questions about your lessons
- Provide additional explanations for difficult concepts
- Suggest learning activities tailored to your needs
- Give you practice questions`;
      } else {
        aiResponse = `That's an interesting question! I'm programmed to help with your educational needs in Math, English, and Science. Can you tell me more about what specific topic you're studying or what kind of help you need?`;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader bgColor="primary">
          <DialogTitle className="text-white">EduAI Helper</DialogTitle>
        </DialogHeader>
        
        <DialogBody className="h-80 overflow-y-auto p-4 bg-gray-50">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                  <span className="material-icons text-primary-600 text-sm">smart_toy</span>
                </div>
              )}
              
              <div 
                className={`${
                  message.sender === 'ai' 
                    ? 'ml-3 bg-white text-gray-800' 
                    : 'mr-3 bg-primary-50 text-gray-800'
                } p-3 rounded-lg shadow-sm max-w-[80%]`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback colorVariant="primary">
                    {user ? getInitials(user.firstName, user.lastName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </DialogBody>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your learning assistant..."
            className="flex-1 border border-gray-300"
          />
          <Button 
            type="submit" 
            className="ml-2 p-2 rounded-full" 
            size="icon"
            disabled={!inputValue.trim()}
          >
            <span className="material-icons">send</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatModal;
