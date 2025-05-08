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
import { useAuth } from '@/hooks/use-auth';
import { getInitials } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useAiTutor } from '@/hooks/useAiTutor';
import AiChatSources from './AiChatSources';

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

type AiChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AI_INITIAL_MESSAGE = `Hi there! I'm JubunuAI, your learning assistant. How can I help you today?`;

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
  const { user } = useAuth();
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
        subject: null,
        sources: [] // Empty sources array for welcome message
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
      <DialogContent className="w-[calc(100%-20px)] sm:w-full max-w-[340px] sm:max-w-md md:max-w-2xl h-[85vh] sm:h-[75vh] md:h-[600px] max-h-[600px] p-0 flex flex-col">
        <DialogHeader className="bg-primary text-white p-3 sm:p-4 rounded-t-lg shrink-0">
          <DialogTitle className="text-lg sm:text-xl">JubunuAI Learning Assistant</DialogTitle>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2">
            <Label htmlFor="subject" className="text-white text-xs sm:text-sm sm:mr-2">
              Subject:
            </Label>
            <Select
              value={subject}
              onValueChange={setSubject}
            >
              <SelectTrigger className="w-full sm:w-36 bg-white text-gray-800 text-xs sm:text-sm h-8">
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
        
        <DialogBody className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
          {isLoadingChat ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading chat history...</span>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`flex mb-3 sm:mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                    <span className="material-icons text-primary-600 text-xs sm:text-sm">smart_toy</span>
                  </div>
                )}
                
                <div 
                  className={`${
                    message.role === 'assistant' 
                      ? 'ml-2 sm:ml-3 bg-white text-gray-800' 
                      : 'mr-2 sm:mr-3 bg-primary-50 text-gray-800'
                  } p-2 sm:p-3 rounded-lg shadow-sm max-w-[85%] sm:max-w-[80%] text-xs sm:text-sm md:text-base`}
                >
                  {message.subject && message.role === 'user' && (
                    <div className="text-xs text-gray-500 mb-1">{message.subject}</div>
                  )}
                  <p className="whitespace-pre-line break-words leading-tight sm:leading-normal">{message.content}</p>
                  {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                    <AiChatSources sources={message.sources} />
                  )}
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary-600 text-white text-xs sm:text-sm">
                      {user ? getInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </DialogBody>
        
        <form onSubmit={handleSendMessage} className="p-2 sm:p-3 md:p-4 border-t border-gray-200 flex items-center shrink-0">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 border border-gray-300 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="ml-2 rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 p-0 flex items-center justify-center" 
            size="icon"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <span className="material-icons text-sm sm:text-base">send</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatModal;
