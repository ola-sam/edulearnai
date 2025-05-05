import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInitials } from '@/lib/utils';

type LeaderboardUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  grade: number;
  points: number;
  displayName: string;
};

const LeaderboardPage = () => {
  const { user } = useUser();
  const [gradeFilter, setGradeFilter] = useState('all');
  
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['/api/leaderboard'],
    enabled: !!user,
  });
  
  // Filter leaderboard by grade
  const filteredLeaderboard = gradeFilter === 'all'
    ? leaderboard
    : leaderboard?.filter((entry: LeaderboardUser) => entry.grade.toString() === gradeFilter);
  
  // Find the top score for percentage calculations
  const topScore = filteredLeaderboard?.[0]?.points || 0;
  
  // Find the user's rank
  const getUserRank = () => {
    if (!user || !filteredLeaderboard) return 'N/A';
    const userIndex = filteredLeaderboard.findIndex((entry: LeaderboardUser) => entry.id === user.id);
    return userIndex >= 0 ? `#${userIndex + 1}` : 'N/A';
  };
  
  // Color based on position
  const getPositionColor = (position: number) => {
    if (position === 0) return 'bg-yellow-500 text-white'; // Gold
    if (position === 1) return 'bg-gray-400 text-white'; // Silver
    if (position === 2) return 'bg-amber-700 text-white'; // Bronze
    return 'bg-gray-200 text-gray-700'; // Others
  };
  
  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Leaderboard</h1>
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm animate-pulse">
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-6 flex justify-between animate-pulse">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-2 rounded-lg bg-white">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Leaderboard</h1>
      
      {/* User Stats Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-4 md:mb-0 md:mr-8">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarFallback colorVariant="primary" className="text-xl">
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-nunito font-semibold text-lg text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-500">Grade {user?.grade}</p>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-500">Your Rank</p>
                <p className="font-nunito font-bold text-xl text-primary-700">{getUserRank()}</p>
              </div>
              
              <div className="text-center p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-500">Points</p>
                <p className="font-nunito font-bold text-xl text-primary-700">{user?.points}</p>
              </div>
              
              <div className="text-center p-3 bg-primary-50 rounded-lg col-span-2 md:col-span-1">
                <p className="text-sm text-gray-500">From Top</p>
                <p className="font-nunito font-bold text-xl text-primary-700">
                  {topScore > 0 
                    ? `${Math.round((user?.points / topScore) * 100)}%` 
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Filters */}
      <div className="mb-6 flex justify-between">
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Grade {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Leaderboard List */}
      <div className="space-y-4">
        {filteredLeaderboard?.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">leaderboard</span>
            <p className="text-gray-500">No leaderboard data available for this grade.</p>
          </div>
        ) : (
          filteredLeaderboard?.map((entry: LeaderboardUser, index: number) => {
            const isCurrentUser = entry.id === user?.id;
            const progressPercentage = Math.round((entry.points / topScore) * 100);
            
            return (
              <div 
                key={entry.id} 
                className={`flex items-center space-x-3 p-4 rounded-lg ${
                  isCurrentUser ? 'bg-primary-50' : 'bg-white'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-nunito font-bold ${
                    getPositionColor(index)
                  }`}
                >
                  {index + 1}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarFallback colorVariant={isCurrentUser ? 'primary' : 'default'}>
                    {getInitials(entry.firstName, entry.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 ml-2">
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
          })
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
