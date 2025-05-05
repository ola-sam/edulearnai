import { useState } from 'react';
import Sidebar from './Sidebar';
import AiChatModal from '../ai/AiChatModal';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {children}
        
        {/* AI Chat Helper Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
          >
            <span className="material-icons">smart_toy</span>
          </button>
        </div>
        
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
