import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import SubjectProgress from '@/components/dashboard/SubjectProgress';
import RecommendedLessons from '@/components/dashboard/RecommendedLessons';
import BadgesAchievements from '@/components/dashboard/BadgesAchievements';
import Leaderboard from '@/components/dashboard/Leaderboard';
import OfflineContent from '@/components/dashboard/OfflineContent';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const { user } = useAuth();
  const [lastVisit, setLastVisit] = useLocalStorage<string>('lastDashboardVisit', '');
  
  // Update last visit time for analytics
  useEffect(() => {
    if (user) {
      setLastVisit(new Date().toISOString());
    }
  }, [user]);
  
  // Prefetch related data for better UX
  useEffect(() => {
    if (user) {
      queryClient.prefetchQuery({ queryKey: ['/api/subjects'] });
      queryClient.prefetchQuery({ queryKey: [`/api/users/${user.id}/progress`] });
      queryClient.prefetchQuery({ queryKey: [`/api/users/${user.id}/badges`] });
      queryClient.prefetchQuery({ queryKey: ['/api/leaderboard'] });
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <WelcomeBanner />
      
      {/* Progress Overview */}
      <SubjectProgress />
      
      {/* Personalized Recommendations */}
      <RecommendedLessons />
      
      {/* Badges and Achievements with Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BadgesAchievements />
        <Leaderboard />
      </div>
      
      {/* Offline Content */}
      <OfflineContent />
    </div>
  );
};

export default Dashboard;
