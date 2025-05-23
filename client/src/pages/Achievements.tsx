import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
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
  
  // Map color names to Tailwind classes
  const colorMap: Record<string, { bg: string, text: string, glow: string }> = {
    'primary': { bg: 'bg-primary-100', text: 'text-primary-600', glow: 'badge-glow-primary' },
    'emerald': { bg: 'bg-emerald-100', text: 'text-emerald-600', glow: 'badge-glow-emerald' },
    'amber': { bg: 'bg-amber-100', text: 'text-amber-600', glow: 'badge-glow-amber' },
    'cyan': { bg: 'bg-cyan-100', text: 'text-cyan-600', glow: 'badge-glow-cyan' },
    'purple': { bg: 'bg-purple-100', text: 'text-purple-600', glow: 'badge-glow-purple' }
  };
  
  // Get color classes based on badge color
  const colors = colorMap[badge.color] || { bg: 'bg-primary-100', text: 'text-primary-600', glow: 'badge-glow-primary' };
  
  const bgColorClass = isEarned ? colors.bg : 'bg-gray-100';
  const textColorClass = isEarned ? colors.text : 'text-gray-400';
  const badgeIconClass = badge.icon;
  const glowClass = isEarned ? `badge-glow ${colors.glow}` : '';
  
  // Get a sparkle effect for earned badges
  const earnedDecoration = isEarned ? (
    <div className="absolute -top-1 -right-1 text-yellow-400 transform rotate-12">
      <span className="material-icons text-sm">auto_awesome</span>
    </div>
  ) : null;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center ${bgColorClass} ${glowClass} 
                relative transition-all duration-300 ${isEarned ? 'scale-105' : 'hover:scale-105'}`}
            >
              <span className={`material-icons text-3xl ${textColorClass}`}>
                {badgeIconClass}
              </span>
              {isEarned && (
                <span className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  <span className="material-icons text-xs">check</span>
                </span>
              )}
            </div>
            {earnedDecoration}
          </div>
          
          <h3 className={`font-nunito font-semibold text-lg mb-1 ${isEarned ? 'text-gray-800' : 'text-gray-500'}`}>
            {badge.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3">
            {badge.description}
          </p>
          
          {isEarned ? (
            <div className="mb-2 px-3 py-1 flex items-center gap-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <span className="material-icons text-xs">verified</span>
              <span>Earned {formatDate(new Date(badge.dateEarned || ''))}</span>
            </div>
          ) : (
            <>
              <div className="w-full mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 flex items-center">
                    <span className="material-icons text-xs mr-1">trending_up</span>
                    Progress
                  </span>
                  <span className="font-medium text-gray-700">{badge.progress}%</span>
                </div>
                <Progress value={badge.progress} className="h-2" />
              </div>
              
              <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded-md">
                <span className="material-icons text-xs align-middle mr-1 text-amber-500">tips_and_updates</span>
                {badge.criteria.lessonCount 
                  ? `Complete ${badge.criteria.lessonCount} ${badge.criteria.subject} lessons` 
                  : badge.criteria.perfectScoreStreak 
                  ? `Get perfect scores on ${badge.criteria.perfectScoreStreak} consecutive quizzes` 
                  : badge.criteria.completeAll
                  ? `Complete all ${badge.criteria.subject} lessons in your grade`
                  : badge.criteria.multiSubject
                  ? `Complete ${badge.criteria.lessonCount} lessons across different subjects`
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
  const { user } = useAuth();
  
  const { data: badges = [], isLoading: badgesLoading } = useQuery<any[]>({
    queryKey: ['/api/badges'],
    enabled: !!user,
  });
  
  const { data: userBadges = [], isLoading: userBadgesLoading } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/badges`],
    enabled: !!user,
  });
  
  const { data: userProgress = [] } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });
  
  const { data: quizResults = [] } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id}/quiz-results`],
    enabled: !!user,
  });
  
  const { data: lessons = [] } = useQuery<any[]>({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });
  
  const { data: subjects = [] } = useQuery<any[]>({
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
      
      <div className="mb-8 bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full 
            flex items-center justify-center mb-6 shadow-md relative">
            <span className="material-icons text-primary-600 text-4xl animate-pulse">emoji_events</span>
            <div className="absolute inset-0 rounded-full bg-primary-500 opacity-10 animate-ping-slow"></div>
          </div>
          
          <h2 className="font-nunito font-semibold text-2xl text-gray-800 mb-5 text-center">Your Achievement Stats</h2>
          
          <div className="w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-icons text-primary-500 mr-2">military_tech</span>
                  <p className="text-sm font-medium text-primary-700">Badges Earned</p>
                </div>
                <p className="font-nunito font-bold text-3xl text-primary-700 text-center">{earnedBadges.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-icons text-amber-500 mr-2">pending</span>
                  <p className="text-sm font-medium text-amber-700">In Progress</p>
                </div>
                <p className="font-nunito font-bold text-3xl text-amber-700 text-center">{unearnedBadges.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-icons text-emerald-500 mr-2">percent</span>
                  <p className="text-sm font-medium text-emerald-700">Completion</p>
                </div>
                <p className="font-nunito font-bold text-3xl text-emerald-700 text-center">
                  {badgesWithProgress.length > 0 
                    ? Math.round((earnedBadges.length / badgesWithProgress.length) * 100) 
                    : 0}%
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
          {badgesWithProgress.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 max-w-lg mx-auto">
                <span className="material-icons text-5xl text-gray-400 mb-4 inline-block">emoji_events</span>
                <h3 className="text-xl font-nunito font-bold text-gray-700 mb-2">No Badges Available Yet</h3>
                <p className="text-gray-600 mb-4">Achievements will appear here once they're added to the system. Keep learning in the meantime!</p>
                <div className="flex items-center justify-center gap-2 text-primary-600">
                  <span className="material-icons text-sm">school</span>
                  <span className="text-sm font-medium">Try completing lessons to unlock future achievements</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badgesWithProgress.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="earned">
          {earnedBadges.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
                <span className="material-icons text-5xl text-amber-400 mb-4 inline-block">stars</span>
                <h3 className="text-xl font-nunito font-bold text-gray-700 mb-2">No Badges Earned Yet</h3>
                <p className="text-gray-600 mb-4">Complete lessons, ace quizzes, and learn consistently to earn your first achievement badge!</p>
                <div className="flex items-center justify-center gap-2 text-primary-600">
                  <span className="material-icons text-sm">lightbulb</span>
                  <span className="text-sm font-medium">Tip: Start with completing a subject's lessons to earn a subject badge</span>
                </div>
              </div>
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
          {unearnedBadges.length === 0 && badgesWithProgress.length > 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-8 max-w-lg mx-auto">
                <span className="material-icons text-5xl text-purple-500 mb-4 inline-block">workspace_premium</span>
                <h3 className="text-xl font-nunito font-bold text-gray-700 mb-2">Achievement Master!</h3>
                <p className="text-gray-600 mb-4">Congratulations! You've earned all available badges. You're a true learning champion!</p>
                <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm text-primary-600 font-medium">
                  100% Complete
                </div>
              </div>
            </div>
          ) : unearnedBadges.length === 0 && badgesWithProgress.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto">
                <span className="material-icons text-5xl text-gray-400 mb-4 inline-block">pending_actions</span>
                <h3 className="text-xl font-nunito font-bold text-gray-700 mb-2">No Badges Available</h3>
                <p className="text-gray-600">There are currently no badges available in the system. Check back later for new achievements to earn!</p>
              </div>
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
