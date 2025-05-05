import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import AiChatModal from '@/components/ai/AiChatModal';
import { useQuery } from '@tanstack/react-query';

// Define types for API data
interface Lesson {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  grade: number;
  [key: string]: any;
}

interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  timeSpent: number;
  lastAccessed: string;
  [key: string]: any;
}

interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  dateEarned: string;
  [key: string]: any;
}

const WelcomeBanner = () => {
  const { user } = useAuth();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(0);
  const [recentBadges, setRecentBadges] = useState(0);
  
  // Fetch user progress
  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });
  
  // Fetch user badges
  const { data: userBadges } = useQuery<UserBadge[]>({
    queryKey: [`/api/users/${user?.id}/badges`],
    enabled: !!user,
  });
  
  // Fetch all lessons
  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });
  
  // Calculate weekly progress and recent badges
  useEffect(() => {
    if (userProgress && lessons) {
      // Calculate weekly progress based on completed lessons
      const totalLessonsForGrade = Array.isArray(lessons) 
        ? lessons.filter((l: any) => l.grade === user?.grade).length 
        : 0;
      
      const completedLessons = Array.isArray(userProgress) 
        ? userProgress.filter((p: any) => p.completed).length 
        : 0;
      
      // Arbitrarily define a weekly goal as 20% of total lessons for the grade
      const weeklyGoal = Math.max(1, Math.ceil(totalLessonsForGrade * 0.2));
      const progress = Math.min(Math.round((completedLessons / weeklyGoal) * 100), 100);
      
      setWeeklyGoalProgress(progress);
    }
    
    if (userBadges) {
      // Calculate badges earned in the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentBadgesCount = Array.isArray(userBadges) 
        ? userBadges.filter((badge: any) => {
            const badgeDate = new Date(badge.dateEarned);
            return badgeDate >= oneWeekAgo;
          }).length 
        : 0;
      
      setRecentBadges(recentBadgesCount);
    }
  }, [userProgress, userBadges, lessons, user?.grade]);
  
  const handleContinueLearning = () => {
    // This would navigate to the most recent in-progress lesson
    window.location.href = '/lessons';
  };

  const handleOpenAiTutor = () => {
    setIsAiModalOpen(true);
  };
  
  return (
    <>
      <div className="mx-2 sm:mx-0 mb-8 bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 sm:p-6 md:p-8 flex-1">
            <h2 className="font-nunito font-bold text-xl sm:text-2xl text-gray-800">
              Welcome back, {user?.firstName || 'Student'}!
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Ready to continue your learning journey? Here's what you can learn today:
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-start">
                <span className="material-icons text-primary-600 mr-2 text-base sm:text-lg mt-0.5">check_circle</span>
                <p className="text-gray-600 text-sm sm:text-base">You've completed {weeklyGoalProgress}% of your weekly goal</p>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-warning-500 mr-2 text-base sm:text-lg mt-0.5">star</span>
                <p className="text-gray-600 text-sm sm:text-base">
                  {recentBadges > 0 
                    ? `You've earned ${recentBadges} new badge${recentBadges > 1 ? 's' : ''} this week` 
                    : 'Complete more lessons to earn badges this week'}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <Button onClick={handleContinueLearning} className="text-sm sm:text-base w-full sm:w-auto">
                <span className="material-icons mr-2 text-sm">play_arrow</span>
                Continue Learning
              </Button>
            </div>
          </div>
          <div className="p-6 md:w-1/3 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
            <div className="text-center w-full">
              <div className="font-nunito font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-2">JubunuAI</div>
              <p className="text-primary-100 mb-4 text-sm sm:text-base">Your personalized learning assistant</p>
              <Button
                variant="outline"
                className="px-3 sm:px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 w-full sm:w-auto text-sm sm:text-base"
                onClick={handleOpenAiTutor}
              >
                <span className="material-icons mr-2 text-sm sm:text-base">smart_toy</span>
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
