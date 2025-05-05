import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

type LeaderboardEntry = {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  points: number;
};

const Leaderboard = () => {
  const { user } = useUser();
  
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['/api/leaderboard'],
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Class Leaderboard</h3>
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
  
  const topScore = leaderboard?.[0]?.points || 100;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Class Leaderboard</h3>
        <div className="space-y-4">
          {leaderboard?.slice(0, 3).map((entry: LeaderboardEntry, index: number) => {
            const isCurrentUser = entry.id === user?.id;
            const progressPercentage = Math.round((entry.points / topScore) * 100);
            
            return (
              <div 
                key={entry.id} 
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  isCurrentUser ? 'bg-primary-50' : ''
                }`}
              >
                <div 
                  className={`w-8 h-8 ${
                    index === 0 
                      ? 'bg-primary-500' 
                      : 'bg-gray-200'
                  } rounded-full flex items-center justify-center ${
                    index === 0 ? 'text-white' : 'text-gray-700'
                  } font-nunito font-bold`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {isCurrentUser ? `${entry.displayName} (You)` : entry.displayName}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`${
                        isCurrentUser ? 'bg-primary-600' : 'bg-gray-500'
                      } h-1.5 rounded-full`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  isCurrentUser ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  {entry.points}
                </div>
              </div>
            );
          })}
          
          <Button 
            variant="link" 
            className="mt-2 w-full text-center py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Full Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
