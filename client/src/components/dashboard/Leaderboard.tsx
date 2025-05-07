import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Link } from 'wouter';
import { Trophy, Medal, Award } from 'lucide-react';

type LeaderboardEntry = {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  points: number;
  grade: number;
};

const Leaderboard = () => {
  const { user } = useAuth();
  
  // Fetch leaderboard data with grade filter
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', user?.grade],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/leaderboard?grade=${user.grade}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-nunito font-semibold text-xl text-gray-800">Class Leaderboard</h3>
            <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Grade {user?.grade}</div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"></div>
                </div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            ))}
            <div className="h-8 w-full bg-gray-200 rounded mt-2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const topScore = Array.isArray(leaderboard) && leaderboard.length > 0 ? leaderboard[0].points : 100;
  
  // Get the position icon based on rank
  const getPositionIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (position === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (position === 2) return <Award className="h-4 w-4 text-amber-700" />;
    return position + 1;
  };
  
  // Get the background color based on position
  const getPositionColor = (position: number) => {
    if (position === 0) return 'bg-yellow-100 border-yellow-300';
    if (position === 1) return 'bg-gray-100 border-gray-300';
    if (position === 2) return 'bg-amber-100 border-amber-300';
    return 'bg-white border-gray-200';
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-nunito font-semibold text-lg sm:text-xl text-gray-800">Class Leaderboard</h3>
          <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Grade {user?.grade}</div>
        </div>
        
        <div className="space-y-3">
          {Array.isArray(leaderboard) && leaderboard.slice(0, 3).map((entry: LeaderboardEntry, index: number) => {
            const isCurrentUser = entry.id === user?.id;
            const progressPercentage = Math.round((entry.points / topScore) * 100);
            
            return (
              <div 
                key={entry.id} 
                className={`flex items-center p-3 rounded-lg border ${
                  getPositionColor(index)
                } ${
                  isCurrentUser ? 'ring-1 ring-primary-500' : ''
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-nunito font-bold mr-3
                    ${index < 3 ? 'bg-white text-gray-700 border' : 'bg-gray-200 text-gray-700'}`}
                >
                  {getPositionIcon(index)}
                </div>
                
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback colorVariant={isCurrentUser ? 'primary' : 'default'} className="text-sm">
                    {getInitials(entry.firstName, entry.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {isCurrentUser ? `${entry.displayName} (You)` : entry.displayName}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`${
                        index === 0 
                          ? 'bg-yellow-500' 
                          : (index === 1 
                            ? 'bg-gray-400' 
                            : (index === 2 
                              ? 'bg-amber-700' 
                              : (isCurrentUser ? 'bg-primary-600' : 'bg-gray-500')))
                      } h-1.5 rounded-full`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`font-bold text-sm ml-2 ${
                  isCurrentUser ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  {entry.points}
                </div>
              </div>
            );
          })}
          
          <Link to="/leaderboard">
            <Button 
              variant="outline" 
              className="mt-2 w-full text-center py-1 sm:py-2 text-xs sm:text-sm font-medium"
            >
              View Full Leaderboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
