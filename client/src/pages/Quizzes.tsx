import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLearning } from '@/context/LearningContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';

// Define interfaces for the data we're working with
interface Lesson {
  id: number;
  title: string;
  subjectId: number;
  grade: number;
}

interface Subject {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface QuizResult {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  maxScore: number;
  dateTaken: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  lessonId: number;
  questions: QuizQuestion[];
}

// Types for quiz questions and answers
type QuizQuestion = {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
};

type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
};

const Quizzes = () => {
  const { user } = useAuth();
  const { completeQuiz } = useLearning();
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });
  const [activeTab, setActiveTab] = useState('available');

  // Fetch lessons, quizzes, and results
  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
    enabled: !!user,
  });

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
    enabled: !!user,
  });

  const { data: quizResults } = useQuery<QuizResult[]>({
    queryKey: [`/api/users/${user?.id}/quiz-results`],
    enabled: !!user,
  });

  // Get subject name by id
  const getSubjectByLessonId = (lessonId: number): Subject => {
    if (!lessons || !subjects) return { id: 0, name: '', color: '', icon: '' };
    
    const lesson = lessons.find((l: Lesson) => l.id === lessonId);
    if (!lesson) return { id: 0, name: '', color: '', icon: '' };
    
    const subject = subjects.find((s: Subject) => s.id === lesson.subjectId);
    if (!subject) return { id: 0, name: '', color: '', icon: '' };
    
    return subject;
  };

  // Get lesson title by id
  const getLessonTitle = (lessonId: number): string => {
    if (!lessons) return '';
    const lesson = lessons.find((l: Lesson) => l.id === lessonId);
    return lesson?.title || '';
  };

  // Check if a quiz has been completed
  const isQuizCompleted = (quizId: number): boolean => {
    if (!quizResults) return false;
    return quizResults.some((result: QuizResult) => result.quizId === quizId);
  };

  // Get quiz result by quiz id
  const getQuizResult = (quizId: number): QuizResult | null => {
    if (!quizResults) return null;
    return quizResults.find((result: QuizResult) => result.quizId === quizId) || null;
  };

  // Handle starting a quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setShowResults(false);
    setShowQuiz(true);
  };

  // Handle selecting an answer
  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers(prev => {
      // Check if there's already an answer for this question
      const exists = prev.some(a => a.questionId === questionId);
      
      if (exists) {
        // Update existing answer
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, selectedOptionId: optionId }
            : a
        );
      } else {
        // Add new answer
        return [...prev, { questionId, selectedOptionId: optionId }];
      }
    });
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  // Calculate the quiz score
  const calculateScore = () => {
    if (!activeQuiz) return;
    
    let score = 0;
    const total = activeQuiz.questions.length;
    
    quizAnswers.forEach(answer => {
      const question = activeQuiz.questions.find((q: QuizQuestion) => q.id === answer.questionId);
      if (question && question.correctOptionId === answer.selectedOptionId) {
        score++;
      }
    });
    
    setQuizScore({ score, total });
    
    // Save quiz result
    if (user) {
      completeQuiz(activeQuiz.id, score, total, quizAnswers);
    }
  };

  // Handle quiz completion and return to list
  const handleFinishQuiz = () => {
    setShowQuiz(false);
    setActiveQuiz(null);
  };

  // Get the subject badge variant
  const getSubjectBadgeVariant = (subjectName: string) => {
    const nameToVariant: Record<string, any> = {
      'Mathematics': 'math',
      'English': 'english',
      'Science': 'science'
    };
    return nameToVariant[subjectName] || 'default';
  };

  // Get the subject button variant
  const getSubjectButtonVariant = (subjectName: string) => {
    const nameToVariant: Record<string, any> = {
      'Mathematics': 'math',
      'English': 'english',
      'Science': 'science'
    };
    return nameToVariant[subjectName] || 'default';
  };

  // Loading state
  if (lessonsLoading || quizzesLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Quizzes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-3 bg-gray-200"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-6 w-36 bg-gray-200 rounded mt-2"></div>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter quizzes by user's grade and then separate into completed and available
  const gradeAppropriateQuizzes = quizzes?.filter((quiz: Quiz) => {
    if (!lessons) return false;
    const lesson = lessons.find((l: Lesson) => l.id === quiz.lessonId);
    return lesson && lesson.grade === user?.grade;
  }) || [];
  
  const completedQuizzes = gradeAppropriateQuizzes.filter((quiz: Quiz) => isQuizCompleted(quiz.id)) || [];
  const availableQuizzes = gradeAppropriateQuizzes.filter((quiz: Quiz) => !isQuizCompleted(quiz.id)) || [];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-4">Quizzes</h1>
      
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-6 flex items-center">
        <span className="material-icons text-primary-500 mr-2">filter_list</span>
        <p className="text-sm text-primary-700">
          Showing quizzes for Grade {user?.grade}
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full justify-start border-b pb-0 mb-6">
          <TabsTrigger value="available" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
            Available ({availableQuizzes.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500">
            Completed ({completedQuizzes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {availableQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-400 mb-2">quiz</span>
              <p className="text-gray-500">No available quizzes. Complete some lessons to unlock quizzes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableQuizzes.map((quiz: Quiz) => {
                const subject = getSubjectByLessonId(quiz.lessonId);
                const badgeVariant = getSubjectBadgeVariant(subject.name);
                const buttonVariant = getSubjectButtonVariant(subject.name);
                
                return (
                  <Card 
                    key={quiz.id} 
                    colorTop={badgeVariant === 'math' ? 'primary' : badgeVariant === 'english' ? 'warning' : 'success'}
                  >
                    <CardContent>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge variant={badgeVariant as any}>
                            {subject.name}
                          </Badge>
                          <h4 className="font-nunito font-semibold text-lg text-gray-800 mt-2">
                            {quiz.title}
                          </h4>
                        </div>
                        <span className={`bg-${badgeVariant}-50 p-2 rounded-full text-${badgeVariant}-700`}>
                          <span className="material-icons">quiz</span>
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {quiz.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-gray-500">Related to: {getLessonTitle(quiz.lessonId)}</p>
                        <p className="text-xs text-gray-500">{quiz.questions.length} questions</p>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={buttonVariant}
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        <span className="material-icons mr-1 text-sm">play_arrow</span>
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons text-4xl text-gray-400 mb-2">history</span>
              <p className="text-gray-500">You haven't completed any quizzes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedQuizzes.map((quiz: Quiz) => {
                const subject = getSubjectByLessonId(quiz.lessonId);
                const badgeVariant = getSubjectBadgeVariant(subject.name);
                const buttonVariant = getSubjectButtonVariant(subject.name);
                const result = getQuizResult(quiz.id);
                const scorePercentage = result ? Math.round((result.score / result.maxScore) * 100) : 0;
                
                return (
                  <Card 
                    key={quiz.id} 
                    colorTop={badgeVariant === 'math' ? 'primary' : badgeVariant === 'english' ? 'warning' : 'success'}
                  >
                    <CardContent>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge variant={badgeVariant as any}>
                            {subject.name}
                          </Badge>
                          <h4 className="font-nunito font-semibold text-lg text-gray-800 mt-2">
                            {quiz.title}
                          </h4>
                        </div>
                        <span className={`bg-${badgeVariant}-50 p-2 rounded-full text-${badgeVariant}-700`}>
                          <span className="material-icons">check_circle</span>
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score</span>
                          <span className="font-medium">{result?.score}/{result?.maxScore} ({scorePercentage}%)</span>
                        </div>
                        <Progress 
                          value={scorePercentage} 
                          variant={badgeVariant === 'math' ? 'primary' : 
                                 badgeVariant === 'english' ? 'warning' : 'success'} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-gray-500">Related to: {getLessonTitle(quiz.lessonId)}</p>
                        <p className="text-xs text-gray-500">
                          Completed {result ? formatDate(new Date(result.dateTaken)) : ''}
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={buttonVariant}
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        <span className="material-icons mr-1 text-sm">refresh</span>
                        Take Again
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quiz Modal */}
      {activeQuiz && (
        <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
          <DialogContent className="max-w-md">
            <DialogHeader 
              bgColor={
                getSubjectByLessonId(activeQuiz.lessonId).name === 'Mathematics' ? 'primary' :
                getSubjectByLessonId(activeQuiz.lessonId).name === 'English' ? 'warning' : 'success'
              }
            >
              <DialogTitle className="text-white">{activeQuiz.title}</DialogTitle>
            </DialogHeader>
            
            <DialogBody>
              {!showResults ? (
                // Quiz Questions
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <Badge variant={
                      getSubjectBadgeVariant(getSubjectByLessonId(activeQuiz.lessonId).name) as any
                    }>
                      Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                    </Badge>
                    
                    <Progress 
                      className="w-1/2" 
                      value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}
                      variant={
                        getSubjectByLessonId(activeQuiz.lessonId).name === 'Mathematics' ? 'primary' :
                        getSubjectByLessonId(activeQuiz.lessonId).name === 'English' ? 'warning' : 'success'
                      }
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-4">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h3>
                    
                    <RadioGroup 
                      value={
                        quizAnswers.find(a => a.questionId === activeQuiz.questions[currentQuestionIndex].id)?.selectedOptionId || ''
                      }
                      onValueChange={(value) => 
                        handleSelectAnswer(activeQuiz.questions[currentQuestionIndex].id, value)
                      }
                    >
                      {activeQuiz.questions[currentQuestionIndex].options.map((option: {id: string; text: string}) => (
                        <div key={option.id} className="flex items-center space-x-2 mb-4 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ) : (
                // Quiz Results
                <div className="text-center py-4">
                  <div className="mb-6">
                    <span className={`material-icons text-4xl ${
                      quizScore.score === quizScore.total ? 'text-success-500' :
                      quizScore.score >= quizScore.total * 0.7 ? 'text-warning-500' :
                      'text-error-500'
                    }`}>
                      {quizScore.score === quizScore.total ? 'emoji_events' :
                       quizScore.score >= quizScore.total * 0.7 ? 'stars' :
                       'sentiment_satisfied_alt'}
                    </span>
                    <h3 className="font-nunito font-bold text-xl mt-2">
                      {quizScore.score === quizScore.total ? 'Perfect Score!' :
                       quizScore.score >= quizScore.total * 0.7 ? 'Great Job!' :
                       'Good Effort!'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      You scored {quizScore.score} out of {quizScore.total} points.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-center items-center mb-2">
                      <div className="w-24 h-24 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-nunito font-bold text-2xl">
                            {Math.round((quizScore.score / quizScore.total) * 100)}%
                          </span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            className="text-gray-200" 
                            strokeWidth="10" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="40" 
                            cx="50" 
                            cy="50"
                          />
                          <circle 
                            className={`${
                              quizScore.score === quizScore.total ? 'text-success-500' :
                              quizScore.score >= quizScore.total * 0.7 ? 'text-warning-500' :
                              'text-error-500'
                            }`}
                            strokeWidth="10" 
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - quizScore.score / quizScore.total)}`}
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="40" 
                            cx="50" 
                            cy="50"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      {quizScore.score === quizScore.total 
                        ? 'Congratulations! You got all questions correct.' 
                        : `You got ${quizScore.score} out of ${quizScore.total} questions correct.`}
                    </p>
                  </div>
                  
                  {quizScore.score === quizScore.total && (
                    <div className="mb-6 p-4 bg-success-50 rounded-lg text-success-700 text-sm">
                      <span className="material-icons text-sm align-middle mr-1">add_circle</span>
                      You earned 10 points for achieving a perfect score!
                    </div>
                  )}
                </div>
              )}
            </DialogBody>
            
            <DialogFooter>
              {!showResults ? (
                <Button 
                  onClick={handleNextQuestion}
                  variant={getSubjectButtonVariant(getSubjectByLessonId(activeQuiz.lessonId).name)}
                  disabled={!quizAnswers.some(a => a.questionId === activeQuiz.questions[currentQuestionIndex].id)}
                >
                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <>Next Question</>
                  ) : (
                    <>Finish Quiz</>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleFinishQuiz}
                  variant={getSubjectButtonVariant(getSubjectByLessonId(activeQuiz.lessonId).name)}
                >
                  Return to Quizzes
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Quizzes;
