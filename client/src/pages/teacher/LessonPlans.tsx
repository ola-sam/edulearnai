import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen,
  MoreVertical,
  Plus,
  Search,
  Calendar,
  FileType,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const TeacherLessonPlans = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterSubject, setFilterSubject] = React.useState('all');

  // Define proper types for our API responses
  type LessonPlanType = {
    id: number;
    title: string;
    description: string;
    teacherId: number;
    classId: number;
    className: string;
    subject: string;
    grade: number;
    status: string;
    duration: number;
    lessonDate: string;
    createdAt: string;
    updatedAt: string;
  };

  // Query to get teacher's lesson plans with proper type
  const { data: lessonPlans = [], isLoading } = useQuery<LessonPlanType[]>({
    queryKey: ['/api/teacher/lesson-plans'],
    enabled: !!user?.isTeacher,
  });

  // Get unique subjects for the filter
  const subjects = React.useMemo(() => {
    const subjectSet = new Set<string>();
    lessonPlans.forEach(plan => subjectSet.add(plan.subject));
    return Array.from(subjectSet);
  }, [lessonPlans]);

  // Filtered lesson plans based on search term and filters
  const filteredLessonPlans = React.useMemo(() => {
    return lessonPlans.filter(plan => {
      const matchesSearch = !searchTerm || 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.className?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
      const matchesSubject = filterSubject === 'all' || plan.subject === filterSubject;
      
      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [lessonPlans, searchTerm, filterStatus, filterSubject]);

  // Helper function to format lesson duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get a color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lesson Plans</h1>
          <p className="text-muted-foreground">
            Create and manage your lesson plans
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/lesson-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Lesson Plan
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lesson plans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-muted rounded-md w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredLessonPlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessonPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <CardDescription>
                      {plan.subject} • Grade {plan.grade} • {plan.className}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/lesson-plans/${plan.id}`}>View Lesson Plan</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/lesson-plans/${plan.id}/edit`}>Edit Lesson Plan</Link>
                      </DropdownMenuItem>
                      {plan.status === 'draft' ? (
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                      ) : plan.status === 'published' ? (
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Restore</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {plan.description || "No description provided."}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(plan.lessonDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(plan.duration)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FileType className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-xs text-muted-foreground">
                      {plan.subject}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" asChild className="w-full">
                  <Link href={`/teacher/lesson-plans/${plan.id}`}>
                    View Lesson Plan
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/10">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          {searchTerm || filterStatus !== 'all' || filterSubject !== 'all' ? (
            <>
              <h3 className="text-lg font-medium mb-2">No matching lesson plans found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search term
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterSubject('all');
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No lesson plans yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't created any lesson plans yet. Create your first plan to get started.
              </p>
              <Button asChild>
                <Link href="/teacher/lesson-plans/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Lesson Plan
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherLessonPlans;