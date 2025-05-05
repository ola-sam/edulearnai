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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAiTutor } from '@/hooks/useAiTutor';

interface ChatMessage {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
  subject: string | null;
}

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
  const [inputValue, setInputValue] = useState('');
  const [subject, setSubject] = useState<string>('General');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom AI Tutor hook
  const {
    chatHistory,
    isLoadingChat,
    isLoading,
    sendMessage
  } = useAiTutor({ enabled: isOpen && !!user });

  // Initialize welcome message if no chat history
  const messages = chatHistory?.length > 0
    ? chatHistory
    : [{
        id: 0,
        userId: user?.id || 0,
        content: AI_INITIAL_MESSAGE,
        timestamp: new Date(),
        role: 'assistant',
        subject: null
      }];
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !user) return;

    try {
      await sendMessage({
        message: inputValue,
        subject
      });
      
      setInputValue('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="w-full max-w-md md:max-w-2xl">
        <DialogHeader className="bg-primary text-white p-4 rounded-t-lg">
          <DialogTitle>EduAI Learning Assistant</DialogTitle>
          <div className="flex items-center mt-2">
            <Label htmlFor="subject" className="text-white text-sm mr-2">
              Subject:
            </Label>
            <Select
              value={subject}
              onValueChange={setSubject}
            >
              <SelectTrigger className="w-36 bg-white text-gray-800 text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <DialogBody className="h-96 overflow-y-auto p-4 bg-gray-50">
          {isLoadingChat ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <span className="ml-2 text-gray-600">Loading chat history...</span>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                    <span className="material-icons text-primary-600 text-sm">smart_toy</span>
                  </div>
                )}
                
                <div 
                  className={`${
                    message.role === 'assistant' 
                      ? 'ml-3 bg-white text-gray-800' 
                      : 'mr-3 bg-primary-50 text-gray-800'
                  } p-3 rounded-lg shadow-sm max-w-[80%]`}
                >
                  {message.subject && message.role === 'user' && (
                    <div className="text-xs text-gray-500 mb-1">{message.subject}</div>
                  )}
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary-600 text-white">
                      {user ? getInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </DialogBody>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 border border-gray-300"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="ml-2 p-2 rounded-full" 
            size="icon"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="material-icons">send</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatModal;
