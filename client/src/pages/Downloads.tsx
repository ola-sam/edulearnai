import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { formatBytes } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLearning } from '@/context/LearningContext';

type DownloadedContent = {
  id: number;
  userId: number;
  lessonId: number;
  downloadedAt: string;
  status: 'completed' | 'in_progress' | 'paused';
  progress: number;
  lesson?: {
    id: number;
    title: string;
    subjectId: number;
    duration: number;
    downloadSize: number;
    subject?: {
      name: string;
      icon: string;
      color: string;
    };
  };
};

const Downloads = () => {
  const { user } = useUser();
  const { downloadLesson } = useLearning();
  const isOnline = useOnlineStatus();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<DownloadedContent | null>(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 100000 }); // In KB
  
  // Fetch downloads, lessons, and subjects
  const { data: downloads, isLoading, refetch } = useQuery({
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
  
  // Update download progress mutation
  const { mutate: updateProgress } = useMutation({
    mutationFn: async ({ id, progress, status }: { id: number, progress: number, status: string }) => {
      return apiRequest('PUT', `/api/downloads/${id}`, { progress, status });
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  // Calculate storage information
  useState(() => {
    if (downloads && lessons) {
      const used = downloads.reduce((total: number, download: DownloadedContent) => {
        const lesson = lessons.find((l: any) => l.id === download.lessonId);
        if (lesson && download.status === 'completed') {
          return total + (lesson.downloadSize || 0);
        }
        return total;
      }, 0);
      
      setStorageInfo({ used, total: 100000 }); // 100MB as example
    }
  });
  
  // Enhance downloads with lesson and subject information
  const enhancedDownloads = downloads?.map((download: DownloadedContent) => {
    const lesson = lessons?.find((l: any) => l.id === download.lessonId);
    const subject = lesson ? subjects?.find((s: any) => s.id === lesson.subjectId) : null;
    
    return {
      ...download,
      lesson: {
        ...lesson,
        subject
      }
    };
  });
  
  // Handle resume download
  const handleResumeDownload = (download: DownloadedContent) => {
    if (!isOnline) return;
    
    // Simulate resume download
    updateProgress({ 
      id: download.id, 
      progress: download.progress, 
      status: 'in_progress' 
    });
    
    // Simulate progress updates
    const interval = setInterval(() => {
      const newProgress = Math.min(download.progress + 5, 100);
      updateProgress({ 
        id: download.id, 
        progress: newProgress, 
        status: newProgress === 100 ? 'completed' : 'in_progress' 
      });
      
      if (newProgress === 100) {
        clearInterval(interval);
      }
    }, 500);
  };
  
  // Handle pause download
  const handlePauseDownload = (download: DownloadedContent) => {
    updateProgress({ 
      id: download.id, 
      progress: download.progress, 
      status: 'paused' 
    });
  };
  
  // Handle delete download confirmation
  const handleShowDeleteConfirm = (download: DownloadedContent) => {
    setSelectedDownload(download);
    setShowConfirmDelete(true);
  };
  
  // Handle actual delete
  const handleDeleteDownload = () => {
    if (!selectedDownload) return;
    
    // In a real app, we would delete the download from the server
    // and also remove the cached content
    
    setShowConfirmDelete(false);
    setSelectedDownload(null);
    refetch();
  };
  
  // Handle new download
  const handleNewDownload = () => {
    if (!isOnline) return;
    window.location.href = '/lessons';
  };
  
  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Downloads</h1>
        <Card className="mb-6 animate-pulse">
          <CardContent className="pt-6">
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
          </CardContent>
        </Card>
        
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  const usedPercentage = Math.round((storageInfo.used / storageInfo.total) * 100);
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Downloads</h1>
      
      {/* Storage info card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="font-nunito font-semibold text-lg text-gray-800 mb-2">Storage</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Used: {formatBytes(storageInfo.used * 1024)}</span>
              <span>Available: {formatBytes((storageInfo.total - storageInfo.used) * 1024)}</span>
            </div>
            <Progress value={usedPercentage} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`flex h-3 w-3 relative mr-2`}>
                {isOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                )}
              </span>
              <span className={`text-sm font-medium ${
                isOnline ? 'text-success-600' : 'text-gray-600'
              }`}>
                {isOnline ? 'Online - Ready to download' : 'Offline - Downloads available'}
              </span>
            </div>
            
            <Button 
              onClick={handleNewDownload} 
              disabled={!isOnline}
            >
              <span className="material-icons mr-1 text-sm">add</span>
              New Download
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Downloaded content list */}
      <div className="space-y-3">
        {enhancedDownloads?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <span className="material-icons text-4xl text-gray-400 mb-2">cloud_download</span>
            <p className="text-gray-500 mb-4">No downloaded content yet</p>
            <Button 
              onClick={handleNewDownload}
              disabled={!isOnline}
            >
              <span className="material-icons mr-1 text-sm">add</span>
              Download Your First Lesson
            </Button>
          </div>
        ) : (
          enhancedDownloads?.map((download: DownloadedContent) => (
            <div key={download.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg">
              <div className="flex items-center">
                <span className={`material-icons ${
                  download.status === 'completed' 
                    ? 'text-success-500' 
                    : download.status === 'in_progress'
                    ? 'text-warning-500'
                    : 'text-gray-500'
                } mr-3`}>
                  {download.status === 'completed' ? 'check_circle' : 
                   download.status === 'in_progress' ? 'downloading' : 'pause_circle'}
                </span>
                
                <div>
                  <p className="font-medium text-gray-800">{download.lesson?.title}</p>
                  <div className="flex items-center">
                    <Badge 
                      variant={
                        download.lesson?.subject?.name === 'Mathematics' ? 'math' :
                        download.lesson?.subject?.name === 'English' ? 'english' : 'science'
                      }
                      className="mr-2"
                    >
                      {download.lesson?.subject?.name}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {download.lesson?.duration} min • {
                        formatBytes(download.lesson?.downloadSize || 0)
                      }
                    </p>
                  </div>
                  
                  {download.status !== 'completed' && (
                    <div className="flex items-center mt-1">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`${
                            download.status === 'in_progress' ? 'bg-warning-500' : 'bg-gray-400'
                          } h-1.5 rounded-full`} 
                          style={{ width: `${download.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{download.progress}%</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex">
                {download.status === 'in_progress' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handlePauseDownload(download)}
                  >
                    <span className="material-icons">pause</span>
                  </Button>
                )}
                
                {download.status === 'paused' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleResumeDownload(download)}
                    disabled={!isOnline}
                  >
                    <span className="material-icons">play_arrow</span>
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleShowDeleteConfirm(download)}
                >
                  <span className="material-icons text-error-500">delete</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader bgColor="destructive">
            <DialogTitle className="text-white">Confirm Delete</DialogTitle>
          </DialogHeader>
          
          <DialogBody>
            <p>Are you sure you want to delete "{selectedDownload?.lesson?.title}"?</p>
            <p className="text-sm text-gray-500 mt-2">
              This will remove the downloaded content and free up {
                formatBytes(selectedDownload?.lesson?.downloadSize || 0)
              } of storage.
            </p>
          </DialogBody>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDownload}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Downloads;
