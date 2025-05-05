import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateDifficultyStars } from '@/lib/utils';

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
  isNew?: boolean;
};

const RecommendedLessons = () => {
  const { user } = useUser();
  const { startLesson } = useLearning();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/recommendations`],
    enabled: !!user,
  });
  
  const { data: userProgress } = useQuery({
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
    if (!userProgress) return false;
    return userProgress.some((progress: any) => progress.lessonId === lessonId);
  };
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-nunito font-semibold text-xl text-gray-800">Recommended for You</h3>
          <div className="text-sm text-primary-600 font-medium">
            Based on your recent activity
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-3 bg-gray-200"></div>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-6 w-36 bg-gray-200 rounded mt-2"></div>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-4 bg-gray-200 rounded-full mr-1"></div>
                    ))}
                  </div>
                  <div className="h-4 w-14 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-lg mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-nunito font-semibold text-xl text-gray-800">Recommended for You</h3>
        <div className="text-sm text-primary-600 font-medium">
          Based on your recent activity
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations?.map((lesson: RecommendedLesson) => {
          const badgeVariant = subjectToBadgeVariant[lesson.subjectName] || 'default';
          const buttonVariant = subjectToButtonVariant[lesson.subjectName] || 'default';
          const difficultyStars = generateDifficultyStars(lesson.difficulty);
          
          return (
            <Card 
              key={lesson.id} 
              colorTop={badgeVariant === 'math' ? 'primary' : badgeVariant === 'english' ? 'warning' : 'success'}
            >
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant={badgeVariant as any}>
                      {lesson.subjectName}
                    </Badge>
                    <div className="flex items-center mt-2">
                      <h4 className="font-nunito font-semibold text-lg text-gray-800">
                        {lesson.title}
                      </h4>
                      {lesson.isNew && (
                        <Badge variant="new" className="ml-2">New</Badge>
                      )}
                    </div>
                  </div>
                  <span className={`bg-${badgeVariant}-50 p-2 rounded-full text-${badgeVariant}-700`}>
                    <span className="material-icons">{lesson.subjectIcon}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {lesson.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {difficultyStars.map((star, index) => (
                      <span key={index} className={`material-icons text-sm ${
                        star === 'filled' ? 'text-warning-400' : 'text-gray-300'
                      }`}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <span className="material-icons text-xs mr-1">schedule</span>
                    {lesson.duration} min
                  </span>
                </div>
                <Button 
                  className="mt-4 w-full" 
                  variant={buttonVariant}
                  onClick={() => startLesson(lesson.id)}
                >
                  <span className="material-icons mr-1 text-sm">play_circle</span>
                  {hasLessonProgress(lesson.id) ? 'Continue Learning' : 'Start Lesson'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedLessons;
