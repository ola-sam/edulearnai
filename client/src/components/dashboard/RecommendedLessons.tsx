import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateDifficultyStars } from '@/lib/utils';

interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  timeSpent: number;
  lastAccessed: string;
}

type RecommendedLesson = {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subjectName: string;
  subjectIcon: string;
  subjectColor: string;
  duration: number;
  difficulty: number;
  priority: number;
  reason: string;
  isNew?: boolean;
};

const RecommendedLessons = () => {
  const { user } = useAuth();
  const { startLesson } = useLearning();
  
  const { data: recommendations, isLoading } = useQuery<RecommendedLesson[]>({
    queryKey: [`/api/users/${user?.id}/recommendations`],
    enabled: !!user,
  });
  
  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });
  
  // Maps subject names to badge variants
  const subjectToBadgeVariant: Record<string, any> = {
    'Mathematics': 'math',
    'English': 'english',
    'Science': 'science',
  };
  
  // Maps subject names to button variants
  const subjectToButtonVariant: Record<string, any> = {
    'Mathematics': 'math',
    'English': 'english',
    'Science': 'science',
  };
  
  // Check if there is progress for a lesson
  const hasLessonProgress = (lessonId: number): boolean => {
    if (!userProgress || !Array.isArray(userProgress)) return false;
    return userProgress.some((progress) => progress.lessonId === lessonId);
  };
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Recommended for You</h3>
        <div className="bg-gray-100 p-6 rounded-lg">Loading recommendations...</div>
      </div>
    );
  }
  
  // Check if we have recommendations to display
  const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-1">
        <h3 className="font-nunito font-semibold text-lg sm:text-xl text-gray-800">Recommended for You</h3>
        <div className="text-xs sm:text-sm text-primary-600 font-medium">
          Based on your recent activity
        </div>
      </div>
      
      {!hasRecommendations ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <span className="material-icons text-gray-400 text-4xl mb-2">school</span>
          <h4 className="text-lg font-semibold text-gray-700 mb-1">No recommendations yet</h4>
          <p className="text-gray-500 text-sm">Complete more quizzes and lessons to get personalized recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {recommendations.map((lesson) => {
            const badgeVariant = subjectToBadgeVariant[lesson.subjectName] || 'default';
            const buttonVariant = subjectToButtonVariant[lesson.subjectName] || 'default';
            const difficultyStars = generateDifficultyStars(lesson.difficulty);
            
            return (
              <Card 
                key={lesson.id} 
                colorTop={badgeVariant === 'math' ? 'primary' : badgeVariant === 'english' ? 'warning' : 'success'}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <Badge variant={badgeVariant as any} className="text-xs sm:text-sm">
                        {lesson.subjectName}
                      </Badge>
                      <h4 className="font-nunito font-semibold text-base sm:text-lg text-gray-800 mt-1 sm:mt-2">
                        {lesson.title}
                      </h4>
                    </div>
                    <span className="material-icons text-primary-600 text-lg">{lesson.subjectIcon}</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {lesson.description}
                  </p>
                  
                  <div className="mb-2 sm:mb-3 flex items-center">
                    <span className="material-icons text-primary-500 text-xs mr-2">recommend</span>
                    <p className="text-xs italic text-primary-600">{lesson.reason}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {difficultyStars.map((star, index) => (
                        <span key={index} className="material-icons text-xs sm:text-sm text-warning-400">
                          {star === 'filled' ? 'star' : 'star_outline'}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <span className="material-icons text-xs mr-1">schedule</span>
                      {lesson.duration} min
                    </span>
                  </div>
                  
                  <Button 
                    className="mt-3 sm:mt-4 w-full text-xs sm:text-sm py-1.5 sm:py-2" 
                    variant="default"
                    onClick={() => startLesson(lesson.id)}
                  >
                    <span className="material-icons mr-1 text-xs sm:text-sm">play_circle</span>
                    {hasLessonProgress(lesson.id) ? 'Continue Learning' : 'Start Lesson'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedLessons;