import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import AiChatModal from '@/components/ai/AiChatModal';

const WelcomeBanner = () => {
  const { user } = useUser();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const handleContinueLearning = () => {
    // This would navigate to the most recent in-progress lesson
    window.location.href = '/lessons';
  };

  const handleOpenAiTutor = () => {
    setIsAiModalOpen(true);
  };
  
  return (
    <>
      <div className="mb-8 bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="md:flex">
          <div className="p-6 md:p-8 flex-1">
            <h2 className="font-nunito font-bold text-2xl text-gray-800">
              Welcome back, {user?.firstName || 'Student'}!
            </h2>
            <p className="mt-2 text-gray-600">
              Ready to continue your learning journey? Here's what you can learn today:
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex">
                <span className="material-icons text-primary-600 mr-2">check_circle</span>
                <p className="text-gray-600">You've completed 65% of your weekly goal</p>
              </div>
              <div className="flex">
                <span className="material-icons text-warning-500 mr-2">star</span>
                <p className="text-gray-600">You've earned 3 new badges this week</p>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={handleContinueLearning} className="mr-3">
                <span className="material-icons mr-2 text-sm">play_arrow</span>
                Continue Learning
              </Button>
            </div>
          </div>
          <div className="md:w-1/3 bg-primary-500 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="font-nunito font-bold text-5xl text-white mb-2">JubunuAI</div>
              <p className="text-primary-100 mb-4">Your personalized learning assistant</p>
              <Button
                variant="outline"
                className="px-4 py-2 bg-white text-primary-600 hover:bg-primary-50"
                onClick={handleOpenAiTutor}
              >
                <span className="material-icons mr-2">smart_toy</span>
                Ask for help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AiChatModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
};

export default WelcomeBanner;
