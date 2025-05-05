import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatBytes } from '@/lib/utils';

type DownloadedContent = {
  id: number;
  userId: number;
  lessonId: number;
  downloadedAt: string;
  status: 'completed' | 'in_progress' | 'paused';
  progress: number;
  lesson?: {
    title: string;
    subjectId: number;
    duration: number;
    downloadSize: number;
    subject?: {
      name: string;
    };
  };
};

const OfflineContent = () => {
  const { user } = useUser();
  
  const { data: downloads, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/downloads`],
    enabled: !!user,
  });
  
  const { data: lessons } = useQuery({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });
  
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
    enabled: !!user,
  });
  
  if (isLoading || !lessons || !subjects) {
    return (
      <div className="mb-8">
        <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Available Offline</h3>
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-56"></div>
              <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
              <div className="h-10 w-full bg-gray-200 rounded-lg mt-2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Enhance downloads with lesson and subject information
  const enhancedDownloads = downloads?.map((download: DownloadedContent) => {
    const lesson = lessons.find((l: any) => l.id === download.lessonId);
    const subject = lesson ? subjects.find((s: any) => s.id === lesson.subjectId) : null;
    
    return {
      ...download,
      lesson: {
        ...lesson,
        subject
      }
    };
  });
  
  const handleManageDownloads = () => {
    window.location.href = '/downloads';
  };
  
  const handleDownloadMore = () => {
    window.location.href = '/lessons';
  };
  
  return (
    <div className="mb-8">
      <h3 className="font-nunito font-semibold text-xl text-gray-800 mb-4">Available Offline</h3>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Download lessons to access them without internet connection.
            </p>
            <Button 
              onClick={handleManageDownloads}
              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-lg hover:bg-primary-200"
              variant="ghost"
            >
              Manage Downloads
            </Button>
          </div>
          
          <div className="space-y-3">
            {enhancedDownloads?.map((download: DownloadedContent) => (
              <div key={download.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center">
                  <span className={`material-icons ${
                    download.status === 'completed' 
                      ? 'text-success-500' 
                      : 'text-warning-500'
                  } mr-3`}>
                    {download.status === 'completed' ? 'check_circle' : 'downloading'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{download.lesson?.title}</p>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500 mr-2">
                        {download.lesson?.subject?.name} • {download.lesson?.duration} min • {
                          formatBytes(download.lesson?.downloadSize || 0)
                        }
                      </p>
                      {download.status !== 'completed' && (
                        <>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                            <div 
                              className="bg-warning-500 h-1.5 rounded-full" 
                              style={{ width: `${download.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 ml-2">{download.progress}%</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="material-icons">
                    {download.status === 'completed' ? 'more_vert' : 'pause'}
                  </span>
                </button>
              </div>
            ))}
            
            <button 
              onClick={handleDownloadMore}
              className="mt-2 w-full flex items-center justify-center py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary-600 hover:border-primary-300 transition duration-150"
            >
              <span className="material-icons mr-2">add</span>
              Download More Content
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineContent;
