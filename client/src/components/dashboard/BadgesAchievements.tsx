import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

type UserBadge = {
  id: number;
  userId: number;
  badgeId: number;
  dateEarned: string;
  badge?: Badge;
};

type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
};

// Enhanced Badge type with earned status and date
type EnhancedBadge = Badge & {
  earned: boolean;
  dateEarned?: string;
};

const BadgesAchievements = () => {
  const { user } = useAuth();
  
  const { data: userBadges, isLoading } = useQuery<UserBadge[]>({
    queryKey: [`/api/users/${user?.id}/badges`],
    enabled: !!user,
  });
  
  const { data: allBadges } = useQuery<Badge[]>({
    queryKey: ['/api/badges'],
    enabled: !!user,
  });
  
  if (isLoading || !allBadges) {
    return (
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Your Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full"></div>
              <div className="h-5 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Create an array of badge data for display
  const badgeData: EnhancedBadge[] = Array.isArray(allBadges) ? allBadges.map((badge: Badge) => {
    const userBadge = Array.isArray(userBadges) 
      ? userBadges.find((ub) => ub.badgeId === badge.id) 
      : undefined;
    return {
      ...badge,
      earned: !!userBadge,
      dateEarned: userBadge?.dateEarned,
    };
  }) : [];
  
  // Organize badges: earned ones first, then locked ones
  const earnedBadges = badgeData.filter((badge: EnhancedBadge) => badge.earned);
  const lockedBadges = badgeData.filter((badge: EnhancedBadge) => !badge.earned);
  const displayBadges = [...earnedBadges, ...lockedBadges].slice(0, 4); // Display up to 4 badges
  
  return (
    <Card className="md:col-span-2">
      <CardContent className="p-4 sm:pt-6">
        <h3 className="font-nunito font-semibold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4">Your Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {displayBadges.map((badge) => (
            <div key={badge.id} className="text-center">
              <div 
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 ${
                  badge.earned 
                    ? `bg-${badge.color.replace('#', '')}-100 badge-glow` 
                    : 'bg-gray-100'
                } rounded-full flex items-center justify-center`}
              >
                <span 
                  className={`material-icons text-xl sm:text-2xl ${
                    badge.earned 
                      ? `text-${badge.color.replace('#', '')}-600` 
                      : 'text-gray-400'
                  }`}
                >
                  {badge.earned ? badge.icon : 'lock'}
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-medium ${badge.earned ? 'text-gray-700' : 'text-gray-400'} line-clamp-1`}>
                {badge.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {badge.earned && badge.dateEarned
                  ? `Earned ${formatDate(new Date(badge.dateEarned))}` 
                  : 'Locked'}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 text-center">
          <Button variant="link" className="text-primary-600 text-xs sm:text-sm font-medium hover:text-primary-700 h-8 px-2">
            View All Badges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesAchievements;
