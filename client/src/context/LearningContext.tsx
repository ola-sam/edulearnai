import { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLocation } from 'wouter';

type LearningContextType = {
  startLesson: (lessonId: number) => void;
  completeLesson: (lessonId: number, timeSpent: number) => Promise<void>;
  downloadLesson: (lessonId: number) => Promise<void>;
  startQuiz: (quizId: number) => void;
  completeQuiz: (quizId: number, score: number, maxScore: number, answers: any[]) => Promise<void>;
  currentLessonId: number | null;
  currentQuizId: number | null;
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

type LearningProviderProps = {
  children: ReactNode;
};

export const LearningProvider = ({ children }: LearningProviderProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
  const [cachedLessons, setCachedLessons] = useLocalStorage<number[]>('cachedLessons', []);
  
  // Create/update user progress mutation
  const { mutate: updateProgress } = useMutation({
    mutationFn: async ({
      lessonId,
      completed,
      timeSpent
    }: {
      lessonId: number;
      completed: boolean;
      timeSpent: number;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const now = new Date();
      
      return apiRequest('POST', `/api/users/${user.id}/progress`, {
        lessonId,
        completed,
        timeSpent,
        lastAccessed: now
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/recommendations`] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive'
      });
      console.error('Error updating progress:', error);
    }
  });
  
  // Create downloaded content mutation
  const { mutate: createDownload } = useMutation({
    mutationFn: async (lessonId: number) => {
      if (!user) throw new Error('User not authenticated');
      
      // Format date correctly for PostgreSQL timestamp
      const now = new Date();
      
      return apiRequest('POST', `/api/users/${user.id}/downloads`, {
        lessonId,
        downloadedAt: now,
        status: 'completed',
        progress: 100
      });
    },
    onSuccess: (_, lessonId) => {
      // Update local cache of downloaded lessons
      setCachedLessons((prev) => 
        prev.includes(lessonId) ? prev : [...prev, lessonId]
      );
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/downloads`] });
      
      toast({
        title: 'Success',
        description: 'Lesson downloaded successfully and available offline.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to download lesson. Please try again.',
        variant: 'destructive'
      });
      console.error('Error downloading lesson:', error);
    }
  });
  
  // Submit quiz result mutation
  const { mutate: submitQuizResult } = useMutation({
    mutationFn: async ({
      quizId,
      score,
      maxScore,
      answers
    }: {
      quizId: number;
      score: number;
      maxScore: number;
      answers: any[];
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const now = new Date();
      
      return apiRequest('POST', `/api/users/${user.id}/quiz-results`, {
        quizId,
        score,
        maxScore,
        dateTaken: now,
        answers
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/quiz-results`] });
      
      // Award points for quiz completion (10 points for perfect score)
      if (variables.score === variables.maxScore && user) {
        const newPoints = user.points + 10;
        
        apiRequest('PUT', `/api/users/${user.id}/points`, { points: newPoints })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
            queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
          });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz results. Please try again.',
        variant: 'destructive'
      });
      console.error('Error submitting quiz results:', error);
    }
  });
  
  // Start a lesson
  const startLesson = (lessonId: number) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to start a lesson.',
        variant: 'destructive'
      });
      return;
    }
    
    setCurrentLessonId(lessonId);
    
    // In a real app, we would navigate to the lesson content page
    // For now, simulate starting a lesson
    updateProgress({
      lessonId,
      completed: false,
      timeSpent: 0
    });
    
    toast({
      title: 'Lesson Started',
      description: 'You have started the lesson. Good luck!',
    });
  };
  
  // Complete a lesson
  const completeLesson = async (lessonId: number, timeSpent: number) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to complete a lesson.',
        variant: 'destructive'
      });
      return Promise.reject(new Error('User not authenticated'));
    }
    
    return new Promise<void>((resolve, reject) => {
      updateProgress({
        lessonId,
        completed: true,
        timeSpent
      }, {
        onSuccess: () => {
          setCurrentLessonId(null);
          
          toast({
            title: 'Lesson Completed',
            description: 'Congratulations on completing the lesson!',
          });
          
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };
  
  // Download a lesson for offline use
  const downloadLesson = async (lessonId: number) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to download a lesson.',
        variant: 'destructive'
      });
      return Promise.reject(new Error('User not authenticated'));
    }
    
    return new Promise<void>((resolve, reject) => {
      createDownload(lessonId, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };
  
  // Start a quiz
  const startQuiz = (quizId: number) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to start a quiz.',
        variant: 'destructive'
      });
      return;
    }
    
    setCurrentQuizId(quizId);
    
    toast({
      title: 'Quiz Started',
      description: 'You have started the quiz. Good luck!',
    });
  };
  
  // Complete a quiz
  const completeQuiz = async (quizId: number, score: number, maxScore: number, answers: any[]) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to complete a quiz.',
        variant: 'destructive'
      });
      return Promise.reject(new Error('User not authenticated'));
    }
    
    return new Promise<void>((resolve, reject) => {
      submitQuizResult({
        quizId,
        score,
        maxScore,
        answers
      }, {
        onSuccess: () => {
          setCurrentQuizId(null);
          
          toast({
            title: 'Quiz Completed',
            description: `You scored ${score} out of ${maxScore} points.`,
          });
          
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };
  
  return (
    <LearningContext.Provider
      value={{
        startLesson,
        completeLesson,
        downloadLesson,
        startQuiz,
        completeQuiz,
        currentLessonId,
        currentQuizId
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = (): LearningContextType => {
  const context = useContext(LearningContext);
  
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  
  return context;
};
