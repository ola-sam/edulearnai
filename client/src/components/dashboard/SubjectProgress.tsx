import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/context/UserContext';
import { useLearning } from '@/context/LearningContext';
import { calculateProgressPercentage } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Subject = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type Progress = {
  subjectId: number;
  subjectName: string;
  subjectIcon: string;
  completed: number;
  total: number;
  lastLesson: string;
  progressPercentage: number;
  colorVariant: 'math' | 'english' | 'science' | 'default';
  colorClass: 'primary' | 'warning' | 'success';
};

// Icons and colors for each subject
const subjectProps = {
  'Mathematics': { icon: 'calculate', variant: 'math' as const, colorClass: 'primary' as const },
  'English': { icon: 'menu_book', variant: 'english' as const, colorClass: 'warning' as const },
  'Science': { icon: 'science', variant: 'science' as const, colorClass: 'success' as const },
};

const SubjectProgress = () => {
  const { user } = useUser();
  const { startLesson } = useLearning();
  const [_, navigate] = useLocation();
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [lastLessonIds, setLastLessonIds] = useState<Record<number, number>>({});
  
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
    enabled: !!user,
  });
  
  const { data: userProgress, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });
  
  const { data: lessons } = useQuery({
    queryKey: ['/api/lessons', { grade: user?.grade }],
    enabled: !!user,
  });
  
  // Handle continue learning button click
  const handleContinueLearning = (subjectId: number) => {
    const lessonId = lastLessonIds[subjectId];
    
    if (lessonId) {
      // Start the lesson via learning context
      startLesson(lessonId);
      // Navigate to the lessons page
      navigate('/lessons');
    } else {
      // If no lesson has been started yet, just navigate to lessons filtered by subject
      navigate(`/lessons?subject=${subjectId}`);
    }
  };

  useEffect(() => {
    if (subjects && lessons && userProgress) {
      const progress: Progress[] = subjects.map((subject: Subject) => {
        const subjectLessons = lessons.filter(
          (lesson: any) => lesson.subjectId === subject.id
        );
        
        const completedLessons = userProgress.filter(
          (progress: any) => 
            progress.completed && 
            subjectLessons.some((lesson: any) => lesson.id === progress.lessonId)
        );
        
        // Find the last accessed lesson for this subject
        const subjectProgress = userProgress
          .filter((progress: any) => 
            subjectLessons.some((lesson: any) => lesson.id === progress.lessonId)
          )
          .sort((a: any, b: any) => 
            new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
          );
        
        const lastAccessedLessonId = subjectProgress.length > 0 ? subjectProgress[0].lessonId : null;
        const lastLesson = lastAccessedLessonId 
          ? lessons.find((l: any) => l.id === lastAccessedLessonId)?.title || 'No lessons yet'
          : 'No lessons yet';
        
        // Store the last lesson ID to be used in the continue button
        if (lastAccessedLessonId) {
          setLastLessonIds(prev => ({
            ...prev,
            [subject.id]: lastAccessedLessonId
          }));
        }
        
        const progressPercentage = calculateProgressPercentage(
          completedLessons.length,
          subjectLessons.length
        );
        
        const props = subjectProps[subject.name as keyof typeof subjectProps] || 
          { icon: 'school', variant: 'default' as const, colorClass: 'primary' as const };
        
        return {
          subjectId: subject.id,
          subjectName: subject.name,
          subjectIcon: props.icon,
          completed: completedLessons.length,
          total: subjectLessons.length,
          lastLesson,
          progressPercentage,
          colorVariant: props.variant,
          colorClass: props.colorClass,
        };
      });
      
      setProgressData(progress);
    }
  }, [subjects, lessons, userProgress]);
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Your Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {progressData.map((progress) => (
          <div key={progress.subjectId} className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-nunito font-semibold text-lg text-gray-800">{progress.subjectName}</h4>
                <p className="text-sm text-gray-500">Grade {user?.grade}</p>
              </div>
              <span className={`material-icons ${progress.colorClass === 'primary' ? 'text-primary-500' : 
                progress.colorClass === 'warning' ? 'text-warning-500' : 
                progress.colorClass === 'success' ? 'text-success-500' : 
                'text-primary-500'}`}>{progress.subjectIcon}</span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress.progressPercentage}%</span>
              </div>
              <Progress 
                value={progress.progressPercentage} 
                variant={progress.colorClass} 
              />
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-3">
                Last lesson: {progress.lastLesson}
              </p>
              <Button
                variant={progress.colorVariant}
                onClick={() => handleContinueLearning(progress.subjectId)}
                className="w-full font-medium flex items-center justify-center gap-2
                transition-all transform hover:scale-[1.02] shadow-sm hover:shadow"
              >
                <span className="material-icons text-sm">play_arrow</span>
                Continue Learning
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
