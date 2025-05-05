import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useLearning } from "@/context/LearningContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const LessonView = () => {
  const { lessonId } = useParams();
  const { completeLesson, downloadLesson } = useLearning();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [readingTime, setReadingTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const id = parseInt(lessonId);

  // Query to fetch lesson details
  const { data: lesson, isLoading } = useQuery({
    queryKey: [`/api/lessons/${id}`],
    enabled: !isNaN(id)
  });

  // Query to fetch subject details
  const { data: subject } = useQuery({
    queryKey: [`/api/subjects/${lesson?.subjectId}`],
    enabled: !!lesson?.subjectId
  });

  // Track reading time
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle lesson completion
  const handleCompleteLesson = async () => {
    try {
      await completeLesson(id, readingTime);
      toast({
        title: "Lesson Completed",
        description: "Congratulations! You've completed this lesson.",
      });
      navigate("/lessons");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record lesson completion.",
        variant: "destructive"
      });
    }
  };

  // Handle lesson download
  const handleDownloadLesson = async () => {
    setIsDownloading(true);
    try {
      await downloadLesson(id);
      toast({
        title: "Download Complete",
        description: "Lesson is now available offline.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine the subject badge variant
  const getSubjectBadgeVariant = (subjectName?: string) => {
    if (!subjectName) return "default";
    
    const nameToVariant: Record<string, string> = {
      'Mathematics': 'math',
      'English': 'english',
      'Science': 'science'
    };
    return nameToVariant[subjectName] || "default";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-700">Lesson Not Found</h2>
              <p className="text-gray-500 mt-2">The lesson you're looking for doesn't exist.</p>
              <Button className="mt-4" onClick={() => navigate("/lessons")}>
                Back to Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader 
          className={`bg-${getSubjectBadgeVariant(subject?.name)}-500 text-white`}
        >
          <div className="flex items-center justify-between">
            <CardTitle>{lesson.title}</CardTitle>
            <div className="text-sm">Grade {lesson.grade}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="material-icons mr-2">subject</span>
              <span>{subject?.name || 'Loading...'}</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">timer</span>
              <span>{lesson.duration} min</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <div>Your Progress</div>
              <div>{Math.min(Math.floor(readingTime / (lesson.duration * 60) * 100), 99)}%</div>
            </div>
            <Progress value={Math.min(Math.floor(readingTime / (lesson.duration * 60) * 100), 99)} className="mb-6" />
          </div>

          <div className="flex gap-4 mt-4">
            <Button 
              onClick={handleCompleteLesson}
              variant={getSubjectBadgeVariant(subject?.name) as "math" | "english" | "science" | "default"}
              className="flex-1"
            >
              <span className="material-icons mr-2">check_circle</span>
              Complete Lesson
            </Button>
            
            <Button 
              onClick={handleDownloadLesson}
              variant="outline"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <span className="material-icons animate-spin mr-2">refresh</span>
              ) : (
                <span className="material-icons mr-2">download</span>
              )}
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
            
            <Button 
              onClick={() => navigate("/lessons")}
              variant="outline"
            >
              <span className="material-icons mr-2">arrow_back</span>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonView;