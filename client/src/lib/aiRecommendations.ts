import { lessons, subjects } from '@shared/schema';

type UserData = {
  userId: number;
  grade: number;
  progress: any[];
  quizResults: any[];
  downloadedContent: any[];
};

type RecommendationParams = {
  lessonId: number;
  priority: number;
  reason: string;
};

// Main recommendation engine function
export function generateRecommendations(
  userData: UserData,
  allLessons: any[],
  allSubjects: any[]
): RecommendationParams[] {
  const recommendations: RecommendationParams[] = [];
  
  // Filter lessons for the user's grade
  const gradeAppropriate = allLessons.filter(lesson => 
    lesson.grade === userData.grade
  );
  
  // Get lessons the user has started but not completed
  const inProgressLessons = gradeAppropriate.filter(lesson => {
    const progress = userData.progress.find(p => p.lessonId === lesson.id);
    return progress && !progress.completed;
  });
  
  // Add in-progress lessons with high priority
  inProgressLessons.forEach(lesson => {
    recommendations.push({
      lessonId: lesson.id,
      priority: 10, // Highest priority
      reason: 'Continue where you left off'
    });
  });
  
  // Get lessons the user hasn't started yet
  const notStartedLessons = gradeAppropriate.filter(lesson => 
    !userData.progress.some(p => p.lessonId === lesson.id)
  );
  
  // Add lessons user hasn't started with medium priority
  notStartedLessons.forEach(lesson => {
    recommendations.push({
      lessonId: lesson.id,
      priority: 5, // Medium priority
      reason: 'New content for you'
    });
  });
  
  // Get lessons with related subjects from quizzes the user has done well on
  const goodQuizResults = userData.quizResults.filter(result => 
    result.score / result.maxScore >= 0.8
  );
  
  goodQuizResults.forEach(result => {
    // Find the lesson associated with this quiz
    const quizLesson = allLessons.find(lesson => 
      lesson.id === result.lessonId
    );
    
    if (quizLesson) {
      // Find other lessons in the same subject
      const relatedLessons = gradeAppropriate.filter(lesson => 
        lesson.subjectId === quizLesson.subjectId && 
        lesson.id !== quizLesson.id &&
        !userData.progress.some(p => p.lessonId === lesson.id && p.completed)
      );
      
      relatedLessons.forEach(lesson => {
        recommendations.push({
          lessonId: lesson.id,
          priority: 7, // High-medium priority
          reason: 'Based on your quiz performance'
        });
      });
    }
  });
  
  // Get lessons with subjects where user has low quiz scores
  const poorQuizResults = userData.quizResults.filter(result => 
    result.score / result.maxScore < 0.6
  );
  
  poorQuizResults.forEach(result => {
    // Find the lesson associated with this quiz
    const quizLesson = allLessons.find(lesson => 
      lesson.id === result.lessonId
    );
    
    if (quizLesson) {
      // Find other introductory lessons in the same subject
      const introLessons = gradeAppropriate.filter(lesson => 
        lesson.subjectId === quizLesson.subjectId && 
        lesson.difficulty <= 3 &&
        !userData.progress.some(p => p.lessonId === lesson.id && p.completed)
      );
      
      introLessons.forEach(lesson => {
        recommendations.push({
          lessonId: lesson.id,
          priority: 8, // High priority
          reason: 'To help improve your understanding'
        });
      });
    }
  });
  
  // Time-based recommendations - for lessons user spent a lot of time on
  userData.progress
    .filter(p => p.timeSpent > 1200 && p.completed) // Over 20 minutes spent
    .forEach(progress => {
      const completedLesson = allLessons.find(l => l.id === progress.lessonId);
      
      if (completedLesson) {
        // Find follow-up lessons
        const followUpLessons = gradeAppropriate.filter(lesson => 
          lesson.subjectId === completedLesson.subjectId && 
          lesson.id !== completedLesson.id &&
          lesson.difficulty <= completedLesson.difficulty + 1 &&
          !userData.progress.some(p => p.lessonId === lesson.id && p.completed)
        );
        
        followUpLessons.forEach(lesson => {
          recommendations.push({
            lessonId: lesson.id,
            priority: 6, // Medium-high priority
            reason: 'Based on topics you spent time with'
          });
        });
      }
    });
  
  // Sort by priority (highest first) and remove duplicates
  const uniqueRecommendations = Array.from(
    new Map(recommendations.map(item => [item.lessonId, item])).values()
  );
  
  return uniqueRecommendations.sort((a, b) => b.priority - a.priority);
}

// Helper function to get subject strengths based on quiz performance
export function getUserSubjectStrengths(userData: UserData, allLessons: any[], allSubjects: any[]) {
  const subjectScores: Record<number, { total: number, count: number }> = {};
  
  // Initialize subject scores
  allSubjects.forEach(subject => {
    subjectScores[subject.id] = { total: 0, count: 0 };
  });
  
  // Calculate average scores by subject
  userData.quizResults.forEach(result => {
    const lesson = allLessons.find(l => l.id === result.lessonId);
    if (lesson) {
      const subjectId = lesson.subjectId;
      subjectScores[subjectId].total += (result.score / result.maxScore) * 100;
      subjectScores[subjectId].count += 1;
    }
  });
  
  // Convert to percentages and sort
  const subjectStrengths = Object.entries(subjectScores)
    .filter(([_, data]) => data.count > 0)
    .map(([subjectId, data]) => ({
      subjectId: parseInt(subjectId),
      averageScore: data.total / data.count,
      quizCount: data.count
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
  
  return subjectStrengths;
}
