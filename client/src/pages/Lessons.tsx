import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateProgressPercentage, generateDifficultyStars } from '@/lib/utils';
import { useLearning } from '@/context/LearningContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';

const Lessons = () => {
  const { user } = useAuth();
  const { startLesson, downloadLesson } = useLearning();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>(user?.grade.toString() || 'all');
  const [showLessonDetails, setShowLessonDetails] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch all necessary data
  // Define types
  interface Subject {
    id: number;
    name: string;
    icon: string;
    color: string;
  }

  interface Lesson {
    id: number;
    title: string;
    description: string;
    subjectId: number;
    grade: number;
    duration: number;
    difficulty: number;
    content?: string;
    downloadSize?: number;
  }

  interface UserProgress {
    id: number;
    userId: number;
    lessonId: number;
    completed: boolean;
    timeSpent: number;
    lastAccessed: string;
  }

  interface DownloadedContent {
    id: number;
    userId: number;
    lessonId: number;
    downloadDate: string;
    progress: number;
    status: string;
  }

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
    enabled: !!user,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });

  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${user?.id}/progress`],
    enabled: !!user,
  });

  const { data: downloadedContent } = useQuery<DownloadedContent[]>({
    queryKey: [`/api/users/${user?.id}/downloads`],
    enabled: !!user,
  });

  // Get subject name by id
  const getSubjectName = (subjectId: number) => {
    if (!subjects || !Array.isArray(subjects)) return '';
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || '';
  };

  // Filter lessons based on search and filters
  const filteredLessons = Array.isArray(lessons) ? lessons.filter((lesson: Lesson) => {
    // Search term filter
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = selectedSubject === 'all' || lesson.subjectId.toString() === selectedSubject;
    
    // Grade filter
    const matchesGrade = selectedGrade === 'all' || lesson.grade.toString() === selectedGrade;
    
    return matchesSearch && matchesSubject && matchesGrade;
  }) : [];

  // Handle view lesson details
  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowLessonDetails(true);
  };

  // Handle start lesson
  const handleStartLesson = (lesson: any) => {
    startLesson(lesson.id);
    setShowLessonDetails(false);
  };

  // Handle download lesson
  const handleDownloadLesson = (lesson: any) => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      downloadLesson(lesson.id);
      setIsDownloading(false);
    }, 1500);
  };

  // Check if lesson is downloaded
  const isLessonDownloaded = (lessonId: number) => {
    if (!downloadedContent || !Array.isArray(downloadedContent)) return false;
    return downloadedContent.some(
      (item) => item.lessonId === lessonId && item.status === 'completed'
    );
  };

  // Get progress for a lesson
  const getLessonProgress = (lessonId: number) => {
    if (!userProgress || !Array.isArray(userProgress)) return 0;
    const progress = userProgress.find((p) => p.lessonId === lessonId);
    return progress ? progress.completed ? 100 : Math.min(Math.floor((progress.timeSpent / 60) / 10 * 100), 99) : 0;
  };

  // Determine badge variant based on subject
  const getSubjectBadgeVariant = (subjectName: string) => {
    const nameToVariant: Record<string, any> = {
      'Mathematics': 'math',
      'English': 'english',
      'Science': 'science'
    };
    return nameToVariant[subjectName] || 'default';
  };

  // Determine button variant based on subject
  const getSubjectButtonVariant = (subjectName: string) => {
    const nameToVariant: Record<string, any> = {
      'Mathematics': 'math',
      'English': 'english',
      'Science': 'science'
    };
    return nameToVariant[subjectName] || 'default';
  };

  if (lessonsLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">My Lessons</h1>
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
                <div className="h-4 w-full bg-gray-200 rounded-full mb-4"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">My Lessons</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          className="md:w-1/3"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {Array.isArray(subjects) && subjects.map((subject: Subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="md:w-1/4">
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
      
      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons?.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">search_off</span>
            <p className="text-gray-500">No lessons found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredLessons.map((lesson: Lesson) => {
            const subjectName = getSubjectName(lesson.subjectId);
            const badgeVariant = getSubjectBadgeVariant(subjectName);
            const progressPercentage = getLessonProgress(lesson.id);
            const isDownloaded = isLessonDownloaded(lesson.id);
            
            return (
              <Card 
                key={lesson.id} 
                colorTop={badgeVariant === 'math' ? 'primary' : badgeVariant === 'english' ? 'warning' : 'success'}
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <Badge variant={badgeVariant as any} className="text-xs sm:text-sm">
                        {subjectName}
                      </Badge>
                      <h4 className="font-nunito font-semibold text-base sm:text-lg text-gray-800 mt-1 sm:mt-2">
                        {lesson.title}
                      </h4>
                    </div>
                    <span className={`bg-${badgeVariant}-50 p-1.5 sm:p-2 rounded-full text-${badgeVariant}-700 ml-2 flex-shrink-0`}>
                      <span className="material-icons text-base sm:text-lg">
                        {badgeVariant === 'math' ? 'calculate' : 
                         badgeVariant === 'english' ? 'menu_book' : 'science'}
                      </span>
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {lesson.description}
                  </p>
                  
                  {/* Progress bar */}
                  {progressPercentage > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{progressPercentage}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        variant={badgeVariant === 'math' ? 'primary' : 
                                badgeVariant === 'english' ? 'warning' : 'success'} 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <span className="material-icons text-xs mr-1 text-gray-500">schedule</span>
                      <span className="text-xs text-gray-500">{lesson.duration} min</span>
                    </div>
                    
                    <div className="flex items-center">
                      {isDownloaded && (
                        <span className="material-icons text-xs mr-1 text-success-500">check_circle</span>
                      )}
                      <span className="text-xs text-gray-500">Grade {lesson.grade}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={getSubjectButtonVariant(subjectName) as "math" | "english" | "science" | "default"}
                      className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                      onClick={() => handleStartLesson(lesson)}
                    >
                      <span className="material-icons text-xs sm:text-sm mr-1">play_circle</span>
                      {progressPercentage > 0 ? 'Continue' : 'Start'}
                    </Button>
                    <Button 
                      variant="outline"
                      className="px-2 sm:px-3"
                      onClick={() => handleViewLesson(lesson)}
                    >
                      <span className="material-icons text-xs sm:text-sm">info</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      {/* Lesson Details Dialog */}
      {selectedLesson && (
        <Dialog open={showLessonDetails} onOpenChange={setShowLessonDetails}>
          <DialogContent>
            <DialogHeader 
              bgColor={
                getSubjectName(selectedLesson.subjectId) === 'Mathematics' ? 'primary' :
                getSubjectName(selectedLesson.subjectId) === 'English' ? 'warning' : 'success'
              }
            >
              <DialogTitle className="text-white">Lesson Details</DialogTitle>
            </DialogHeader>
            
            <DialogBody>
              <div className="mb-4">
                <Badge variant={getSubjectBadgeVariant(getSubjectName(selectedLesson.subjectId)) as any}>
                  {getSubjectName(selectedLesson.subjectId)}
                </Badge>
                <h3 className="font-nunito font-semibold text-xl mt-2">{selectedLesson.title}</h3>
                <p className="text-sm text-gray-500">Grade {selectedLesson.grade}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-700">{selectedLesson.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-1">Duration</h4>
                  <div className="flex items-center">
                    <span className="material-icons text-sm text-gray-500 mr-1">schedule</span>
                    <p className="text-sm">{selectedLesson.duration} minutes</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Difficulty</h4>
                  <div className="flex">
                    {generateDifficultyStars(selectedLesson.difficulty).map((star, index) => (
                      <span 
                        key={index}
                        className={`material-icons text-sm ${
                          star === 'filled' ? 'text-warning-400' : 'text-gray-300'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedLesson.downloadSize && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Download Size</h4>
                  <p className="text-sm">{(selectedLesson.downloadSize / 1000).toFixed(1)} MB</p>
                </div>
              )}
              
              {getLessonProgress(selectedLesson.id) > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Your Progress</h4>
                  <Progress 
                    value={getLessonProgress(selectedLesson.id)} 
                    variant={
                      getSubjectName(selectedLesson.subjectId) === 'Mathematics' ? 'primary' :
                      getSubjectName(selectedLesson.subjectId) === 'English' ? 'warning' : 'success'
                    } 
                  />
                </div>
              )}
            </DialogBody>
            
            <DialogFooter>
              {!isLessonDownloaded(selectedLesson.id) && (
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadLesson(selectedLesson)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="material-icons animate-spin mr-1 text-sm">autorenew</span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-1 text-sm">download</span>
                      Download
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={() => handleStartLesson(selectedLesson)}
                variant={getSubjectButtonVariant(getSubjectName(selectedLesson.subjectId)) as "math" | "english" | "science" | "default"}
              >
                <span className="material-icons mr-1 text-sm">play_circle</span>
                {getLessonProgress(selectedLesson.id) > 0 ? 'Continue Learning' : 'Start Lesson'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Lessons;
