import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';

type BadgeWithProgress = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: any;
  earned: boolean;
  dateEarned?: string;
  progress: number;
};

const BadgeCard = ({ badge }: { badge: BadgeWithProgress }) => {
  const isEarned = badge.earned;
  const bgColorClass = isEarned ? `bg-${badge.color.replace('#', '')}-100` : 'bg-gray-100';
  const textColorClass = isEarned ? `text-${badge.color.replace('#', '')}-600` : 'text-gray-400';
  const badgeIconClass = isEarned ? badge.icon : 'lock';
  const glowClass = isEarned ? 'badge-glow' : '';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${bgColorClass} ${glowClass}`}
          >
            <span className={`material-icons text-3xl ${textColorClass}`}>
              {badgeIconClass}
            </span>
          </div>
          
          <h3 className={`font-nunito font-semibold text-lg mb-1 ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>
            {badge.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3">
            {badge.description}
          </p>
          
          {isEarned ? (
            <Badge variant="success" className="mb-2">
              Earned {formatDate(new Date(badge.dateEarned || ''))}
            </Badge>
          ) : (
            <>
              <div className="w-full mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-500">{badge.progress}%</span>
                </div>
                <Progress value={badge.progress} />
              </div>
              
              <div className="text-xs text-gray-500">
                <span className="material-icons text-xs align-middle mr-1">info</span>
                {badge.criteria.lessonCount 
                  ? `Complete ${badge.criteria.lessonCount} ${badge.criteria.subject} lessons` 
                  : badge.criteria.perfectScoreStreak 
                  ? `Get perfect scores on ${badge.criteria.perfectScoreStreak} consecutive quizzes` 
                  : badge.criteria.completeAll
                  ? `Complete all ${badge.criteria.subject} lessons in your grade`
                  : 'Complete specific tasks to earn this badge'}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Achievements = () => {
  const { user } = useUser();
  
  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ['/api/badges'],
    enabled: !!user,
  });
  
  const { data: userBadges, isLoading: userBadgesLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/badges`],
    enabled: !!user,
  });
  
  const { data: userProgress } = useQuery({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });
  
  const { data: quizResults } = useQuery({
    queryKey: [`/api/users/${user?.id}/quiz-results`],
    enabled: !!user,
  });
  
  const { data: lessons } = useQuery({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });
  
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
    enabled: !!user,
  });
  
  if (badgesLoading || userBadgesLoading || !lessons || !subjects) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Achievements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Calculate badge progress
  const badgesWithProgress: BadgeWithProgress[] = badges.map((badge: any) => {
    const userBadge = userBadges?.find((ub: any) => ub.badgeId === badge.id);
    let progress = 0;
    
    if (!userBadge) {
      // Calculate progress based on criteria
      if (badge.criteria.subject) {
        const subjectId = subjects.find((s: any) => s.name === badge.criteria.subject)?.id;
        
        if (subjectId) {
          // Get lessons for this subject
          const subjectLessons = lessons.filter((l: any) => l.subjectId === subjectId && l.grade === user?.grade);
          
          // Get completed lessons for this subject
          const completedLessons = userProgress?.filter(
            (p: any) => p.completed && subjectLessons.some((l: any) => l.id === p.lessonId)
          ) || [];
          
          if (badge.criteria.lessonCount) {
            // Progress based on number of completed lessons
            progress = Math.min(Math.round((completedLessons.length / badge.criteria.lessonCount) * 100), 99);
          } else if (badge.criteria.completeAll) {
            // Progress based on percentage of all lessons completed
            progress = Math.min(Math.round((completedLessons.length / subjectLessons.length) * 100), 99);
          }
        }
      } else if (badge.criteria.perfectScoreStreak) {
        // Calculate the current streak of perfect scores
        const sortedResults = quizResults?.sort((a: any, b: any) => 
          new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime()
        ) || [];
        
        let currentStreak = 0;
        for (const result of sortedResults) {
          if (result.score === result.maxScore) {
            currentStreak++;
          } else {
            break;
          }
        }
        
        progress = Math.min(Math.round((currentStreak / badge.criteria.perfectScoreStreak) * 100), 99);
      }
    }
    
    return {
      ...badge,
      earned: !!userBadge,
      dateEarned: userBadge?.dateEarned,
      progress: userBadge ? 100 : progress
    };
  });
  
  // Separate earned and unearned badges
  const earnedBadges = badgesWithProgress.filter(b => b.earned);
  const unearnedBadges = badgesWithProgress.filter(b => !b.earned);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-nunito font-bold text-2xl text-gray-800">Achievements</h1>
        <p className="text-gray-600">Track your learning achievements and earn badges as you progress</p>
      </div>
      
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <span className="material-icons text-primary-600 text-2xl">emoji_events</span>
          </div>
          <div>
            <h2 className="font-nunito font-semibold text-lg text-gray-800">Your Achievement Stats</h2>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Badges Earned</p>
                <p className="font-nunito font-bold text-2xl text-primary-600">{earnedBadges.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="font-nunito font-bold text-2xl text-warning-500">{unearnedBadges.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion</p>
                <p className="font-nunito font-bold text-2xl text-success-500">
                  {Math.round((earnedBadges.length / badgesWithProgress.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start border-b pb-0 mb-6">
          <TabsTrigger value="all" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
            All Badges ({badgesWithProgress.length})
          </TabsTrigger>
          <TabsTrigger value="earned" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
            Earned ({earnedBadges.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
            In Progress ({unearnedBadges.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgesWithProgress.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="earned">
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-400 mb-2">emoji_events</span>
              <p className="text-gray-500">You haven't earned any badges yet. Keep learning to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="progress">
          {unearnedBadges.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-400 mb-2">check_circle</span>
              <p className="text-gray-500">Congratulations! You've earned all available badges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unearnedBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
