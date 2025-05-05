import { Lesson, Quiz, QuizResult, Subject, User, UserProgress } from "@shared/schema";

/**
 * Types for the recommendation engine
 */
export interface RecommendationInput {
  user: User;
  lessons: Lesson[];
  subjects: Subject[];
  progress: UserProgress[];
  quizResults: QuizResult[];
  quizzes: Quiz[];
}

export interface EnrichedRecommendation extends Lesson {
  subjectName: string;
  subjectIcon: string;
  subjectColor: string;
  priority: number;
  reason: string;
}

/**
 * The main recommendation engine function
 * Creates personalized lesson recommendations based on user's quiz performance and time spent
 */
export function generatePersonalizedRecommendations(
  input: RecommendationInput
): EnrichedRecommendation[] {
  const { user, lessons, subjects, progress, quizResults, quizzes } = input;
  const recommendations: EnrichedRecommendation[] = [];

  // Filter lessons appropriate for the user's grade
  const gradeAppropriateLesson = lessons.filter(
    lesson => lesson.grade === user.grade
  );

  // 1. Get lessons in progress (highest priority)
  const inProgressLessons = gradeAppropriateLesson.filter(lesson => {
    const lessonProgress = progress.find(p => p.lessonId === lesson.id);
    return lessonProgress && !lessonProgress.completed;
  });

  inProgressLessons.forEach(lesson => {
    const subject = subjects.find(s => s.id === lesson.subjectId);
    if (subject) {
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 10, // Highest priority
        reason: "Continue where you left off"
      });
    }
  });

  // 2. Recommend lessons based on low quiz scores (to improve weak areas)
  const lowScoreResults = quizResults.filter(
    result => (result.score / result.maxScore) < 0.7
  );

  lowScoreResults.forEach(result => {
    // Find the quiz
    const quiz = quizzes.find(q => q.id === result.quizId);
    if (!quiz) return;

    // Find the lesson associated with this quiz
    const lessonForQuiz = lessons.find(l => l.id === quiz.lessonId);
    if (!lessonForQuiz) return;

    // Find the subject for this lesson
    const subject = subjects.find(s => s.id === lessonForQuiz.subjectId);
    if (!subject) return;

    // Find related lessons in the same subject with similar or lower difficulty
    const relatedLessons = gradeAppropriateLesson.filter(lesson => 
      lesson.subjectId === lessonForQuiz.subjectId && 
      lesson.id !== lessonForQuiz.id &&
      lesson.difficulty <= lessonForQuiz.difficulty && // Same or easier difficulty
      !progress.some(p => p.lessonId === lesson.id && p.completed) // Not completed yet
    );

    // Add these lessons as high priority recommendations
    relatedLessons.forEach(lesson => {
      const scorePercentage = Math.round((result.score / result.maxScore) * 100);
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 9, // High priority
        reason: `To help with topics where you scored ${scorePercentage}%`
      });
    });
  });

  // 3. Recommend based on time spent (suggest more advanced content in subjects they spend time on)
  const highTimeSpentProgress = progress.filter(
    p => p.timeSpent > 900 && p.completed // Over 15 minutes on a completed lesson
  );

  highTimeSpentProgress.forEach(p => {
    // Find the lesson
    const completedLesson = lessons.find(l => l.id === p.lessonId);
    if (!completedLesson) return;

    // Find the subject
    const subject = subjects.find(s => s.id === completedLesson.subjectId);
    if (!subject) return;

    // Find more advanced lessons in the same subject
    const advancedLessons = gradeAppropriateLesson.filter(lesson => 
      lesson.subjectId === completedLesson.subjectId &&
      lesson.id !== completedLesson.id &&
      lesson.difficulty >= completedLesson.difficulty && // Same or harder difficulty
      !progress.some(prog => prog.lessonId === lesson.id && prog.completed) // Not completed yet
    );

    // Add these as recommendations
    advancedLessons.forEach(lesson => {
      const minutesSpent = Math.round(p.timeSpent / 60);
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 8, // High priority
        reason: `Based on ${minutesSpent} minutes spent on ${subject.name}`
      });
    });
  });

  // 4. Recommend based on high quiz scores (suggest more advanced content)
  const highScoreResults = quizResults.filter(
    result => (result.score / result.maxScore) >= 0.8
  );

  highScoreResults.forEach(result => {
    // Find the quiz
    const quiz = quizzes.find(q => q.id === result.quizId);
    if (!quiz) return;

    // Find the lesson associated with this quiz
    const lessonForQuiz = lessons.find(l => l.id === quiz.lessonId);
    if (!lessonForQuiz) return;

    // Find the subject for this lesson
    const subject = subjects.find(s => s.id === lessonForQuiz.subjectId);
    if (!subject) return;

    // Find more challenging lessons in the same subject
    const challengingLessons = gradeAppropriateLesson.filter(lesson => 
      lesson.subjectId === lessonForQuiz.subjectId && 
      lesson.id !== lessonForQuiz.id &&
      lesson.difficulty > lessonForQuiz.difficulty && // More difficult
      !progress.some(p => p.lessonId === lesson.id && p.completed) // Not completed
    );

    // Add these as recommendations
    challengingLessons.forEach(lesson => {
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 7, // Medium-high priority
        reason: `Ready for more advanced ${subject.name}`
      });
    });
  });

  // 5. Add lessons that haven't been started yet (lowest priority)
  const notStartedLessons = gradeAppropriateLesson.filter(lesson => 
    !progress.some(p => p.lessonId === lesson.id)
  );

  notStartedLessons.forEach(lesson => {
    const subject = subjects.find(s => s.id === lesson.subjectId);
    if (subject) {
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 5, // Medium priority
        reason: "New content for you to explore"
      });
    }
  });

  // Remove duplicates (keep the higher priority one if duplicated)
  const uniqueRecommendations = Array.from(
    new Map(
      recommendations.map(item => [item.id, item])
    ).values()
  );

  // Sort by priority (highest first)
  const sortedRecommendations = uniqueRecommendations.sort((a, b) => b.priority - a.priority);
  
  // If no recommendations, provide fallback recommendations
  if (sortedRecommendations.length === 0) {
    return generateFallbackRecommendations(input);
  }
  
  return sortedRecommendations;
}

/**
 * Generate fallback recommendations when personalized recommendations are not available
 * This ensures users always have something to learn next
 */
function generateFallbackRecommendations(
  input: RecommendationInput
): EnrichedRecommendation[] {
  const { user, lessons, subjects, progress } = input;
  const recommendations: EnrichedRecommendation[] = [];
  
  // Get lessons appropriate for user's grade
  const gradeAppropriateLesson = lessons.filter(
    lesson => lesson.grade === user.grade
  );
  
  // 1. Recommend lessons for the user's grade that they haven't started yet
  const notStartedLessons = gradeAppropriateLesson.filter(lesson => 
    !progress.some(p => p.lessonId === lesson.id)
  );
  
  // Sort by difficulty (easiest first)
  const sortedNotStartedLessons = notStartedLessons.sort((a, b) => a.difficulty - b.difficulty);
  
  // Add fallback recommendations
  sortedNotStartedLessons.forEach(lesson => {
    const subject = subjects.find(s => s.id === lesson.subjectId);
    if (subject) {
      recommendations.push({
        ...lesson,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectColor: subject.color,
        priority: 3, // Medium priority
        reason: "Suggested for your grade level"
      });
    }
  });
  
  // 2. If still no recommendations, recommend any lesson appropriate for the user's grade
  if (recommendations.length === 0) {
    gradeAppropriateLesson.forEach(lesson => {
      const subject = subjects.find(s => s.id === lesson.subjectId);
      if (subject) {
        const isCompleted = progress.some(p => p.lessonId === lesson.id && p.completed);
        
        recommendations.push({
          ...lesson,
          subjectName: subject.name,
          subjectIcon: subject.icon,
          subjectColor: subject.color,
          priority: isCompleted ? 1 : 2, // Lower priority if already completed
          reason: isCompleted 
            ? "Review this completed lesson" 
            : "New content for your grade level"
        });
      }
    });
  }
  
  // Sort by priority and limit
  return recommendations.sort((a, b) => b.priority - a.priority);
}