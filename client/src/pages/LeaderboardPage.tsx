import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

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
  const { user } = useAuth();
  // Initialize gradeFilter to user's grade by default
  const [gradeFilter, setGradeFilter] = useState<string>(user?.grade?.toString() || 'all');
  
  // Set the grade filter to user's grade when user data becomes available
  useEffect(() => {
    if (user?.grade) {
      setGradeFilter(user.grade.toString());
    }
  }, [user]);
  
  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/leaderboard', gradeFilter],
    queryFn: async () => {
      // If grade filter is "all", fetch all users, otherwise fetch users by grade
      const url = gradeFilter === 'all' 
        ? '/api/leaderboard' 
        : `/api/leaderboard?grade=${gradeFilter}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    enabled: !!user,
  });
  
  // Find the top score for percentage calculations
  const topScore = Array.isArray(leaderboard) && leaderboard.length > 0 ? leaderboard[0].points : 0;
  
  // Find the user's rank
  const getUserRank = () => {
    if (!user || !leaderboard) return 'N/A';
    const userIndex = leaderboard.findIndex((entry) => entry.id === user.id);
    return userIndex >= 0 ? `#${userIndex + 1}` : 'N/A';
  };
  
  // Get medal icon based on position
  const getPositionMedal = (position: number) => {
    if (position === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 2) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-bold">{position + 1}</span>;
  };
  
  // Get style based on position
  const getPositionStyle = (position: number, isCurrentUser: boolean) => {
    // Base styles
    let baseStyles = "flex items-center p-4 rounded-lg border";
    
    // Position-specific styles
    if (position === 0) {
      baseStyles += " bg-yellow-50 border-yellow-200";
    } else if (position === 1) {
      baseStyles += " bg-gray-50 border-gray-200";
    } else if (position === 2) {
      baseStyles += " bg-amber-50 border-amber-200";
    } else {
      baseStyles += " bg-white border-gray-100";
    }
    
    // Current user highlight
    if (isCurrentUser) {
      baseStyles += " ring-2 ring-primary-300";
    }
    
    return baseStyles;
  };
  
  // Progress bar color based on position
  const getProgressColor = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary-600';
    if (position === 0) return 'bg-yellow-500';
    if (position === 1) return 'bg-gray-400';
    if (position === 2) return 'bg-amber-700';
    return 'bg-gray-500';
  };
  
  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-nunito font-bold text-2xl text-gray-800">Leaderboard</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center animate-pulse">
              <div className="flex items-center mb-4 md:mb-0 md:mr-8">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-100 rounded-lg">
                    <div className="h-4 w-16 bg-gray-200 rounded mb-2 mx-auto"></div>
                    <div className="h-6 w-10 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-nunito font-bold text-2xl text-gray-800">Leaderboard</h1>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[180px]">
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
      
      {/* User Stats Card */}
      <Card className="mb-8 border-primary-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-primary-700">Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-6 md:mb-0 md:mr-8">
              <Avatar className="w-16 h-16 mr-4 border-2 border-primary-200">
                <AvatarFallback colorVariant="primary" className="text-xl">
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-nunito font-semibold text-lg text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <Badge variant="outline" className="mt-1">Grade {user?.grade}</Badge>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm text-gray-500 mb-1">Your Rank</p>
                <p className="font-nunito font-bold text-xl text-primary-700">{getUserRank()}</p>
              </div>
              
              <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm text-gray-500 mb-1">Points</p>
                <p className="font-nunito font-bold text-xl text-primary-700">{user?.points}</p>
              </div>
              
              <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-100 col-span-2 md:col-span-1">
                <p className="text-sm text-gray-500 mb-1">From Top</p>
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
      
      {/* Top 3 Podium - Desktop only */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="hidden lg:flex justify-center items-end mb-10 mt-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center mx-8">
            <Avatar className="w-16 h-16 mb-2 border-2 border-gray-300">
              <AvatarFallback className="text-xl">
                {getInitials(leaderboard[1].firstName, leaderboard[1].lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{leaderboard[1].displayName}</p>
              <p className="font-bold text-sm text-gray-600">{leaderboard[1].points} pts</p>
            </div>
            <div className="w-24 h-24 bg-gray-200 rounded-t-lg mt-3 flex items-center justify-center">
              <Medal className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="flex flex-col items-center -mb-4">
            <Crown className="h-7 w-7 text-yellow-500 mb-1" />
            <Avatar className="w-20 h-20 mb-2 border-2 border-yellow-300">
              <AvatarFallback className="text-2xl">
                {getInitials(leaderboard[0].firstName, leaderboard[0].lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-lg">{leaderboard[0].displayName}</p>
              <p className="font-bold text-yellow-600">{leaderboard[0].points} pts</p>
            </div>
            <div className="w-32 h-32 bg-yellow-100 rounded-t-lg mt-3 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="flex flex-col items-center mx-8">
            <Avatar className="w-14 h-14 mb-2 border-2 border-amber-300">
              <AvatarFallback className="text-lg">
                {getInitials(leaderboard[2].firstName, leaderboard[2].lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{leaderboard[2].displayName}</p>
              <p className="font-bold text-sm text-gray-600">{leaderboard[2].points} pts</p>
            </div>
            <div className="w-20 h-16 bg-amber-100 rounded-t-lg mt-3 flex items-center justify-center">
              <Award className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No leaderboard data available for this grade.</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to earn points!</p>
          </div>
        ) : (
          leaderboard?.map((entry: LeaderboardUser, index: number) => {
            const isCurrentUser = entry.id === user?.id;
            const progressPercentage = Math.round((entry.points / topScore) * 100);
            
            return (
              <div 
                key={entry.id} 
                className={getPositionStyle(index, isCurrentUser)}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white border">
                  {getPositionMedal(index)}
                </div>
                
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarFallback colorVariant={isCurrentUser ? 'primary' : 'default'} className="text-md">
                    {getInitials(entry.firstName, entry.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-gray-800">
                      {isCurrentUser ? `${entry.firstName} ${entry.lastName} (You)` : `${entry.firstName} ${entry.lastName}`}
                    </p>
                    <Badge variant="outline" className="ml-2 text-xs">Grade {entry.grade}</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`${getProgressColor(index, isCurrentUser)} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`font-bold text-lg ml-2 ${
                  isCurrentUser ? 'text-primary-700' : 
                  (index === 0 ? 'text-yellow-600' : 
                   (index === 1 ? 'text-gray-600' : 
                    (index === 2 ? 'text-amber-700' : 'text-gray-700')))
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
