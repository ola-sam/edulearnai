import { useState } from 'react';
import { useLocation } from 'wouter';
import Sidebar from './Sidebar';
import AiChatModal from '../ai/AiChatModal';
import { useAuth } from '@/hooks/use-auth';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Don't render sidebar or AI chat button on login/register page
  const isAuthPage = location === '/auth';
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {user && <Sidebar />}
      
      <div className="flex-1 overflow-y-auto bg-gray-50 pt-0 md:pt-4 pb-20 md:pb-10">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
          {children}
        </div>
        
        {/* AI Chat Helper Button - only if user is logged in */}
        {user && (
          <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
            >
              <span className="material-icons text-base sm:text-lg">smart_toy</span>
            </button>
          </div>
        )}
        
        {/* AI Chat Modal */}
        <AiChatModal 
          isOpen={isAiModalOpen} 
          onClose={() => setIsAiModalOpen(false)} 
        />
      </div>
    </div>
  );
};

export default AppShell;
