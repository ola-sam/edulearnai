import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BookOpen,
  CheckCircle2,
  Users,
  ListTodo,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// Teacher Dashboard component
const TeacherDashboard = () => {
  const { user } = useAuth();
  
  // Define proper types for our API responses
  type ClassType = {
    id: number;
    name: string;
    description: string;
    grade: number;
    subject: string;
    teacherId: number;
    academicYear: string;
    startDate: string;
    endDate: string;
    classCode: string;
    isActive: boolean;
  };

  type AssignmentType = {
    id: number;
    title: string;
    description: string;
    classId: number;
    className: string;
    dueDate: string;
    status: string;
    assignedDate: string;
  };

  type AnalyticsType = {
    totalStudents: number;
    averageScore: number;
    completionRate: number;
  };

  // Query to get teacher's classes with proper type
  const { data: classes = [], isLoading: classesLoading } = useQuery<ClassType[]>({
    queryKey: ['/api/teacher/classes'],
    enabled: !!user?.isTeacher,
  });
  
  // Query to get recent assignments with proper type
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<AssignmentType[]>({
    queryKey: ['/api/teacher/assignments/recent'],
    enabled: !!user?.isTeacher,
  });
  
  // Query to get student analytics with proper type
  const { data: analytics = { totalStudents: 0, averageScore: 0, completionRate: 0 }, 
    isLoading: analyticsLoading 
  } = useQuery<AnalyticsType>({
    queryKey: ['/api/teacher/analytics/summary'],
    enabled: !!user?.isTeacher,
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/teacher/classes/create">
              <Users className="mr-2 h-4 w-4" />
              Create Class
            </Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/assignments/create">
              <FileText className="mr-2 h-4 w-4" />
              Create Assignment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{classesLoading ? "..." : classes?.length || 0}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/teacher/classes">
              <Button variant="link" className="p-0 h-auto font-normal">View all classes</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignmentsLoading ? "..." : 
              assignments?.filter(a => a.status === 'active')?.length || 0}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/teacher/assignments">
              <Button variant="link" className="p-0 h-auto font-normal">View all assignments</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsLoading ? "..." : 
              analytics?.totalStudents || 0}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/teacher/students">
              <Button variant="link" className="p-0 h-auto font-normal">View all students</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>Your active classes</CardDescription>
          </CardHeader>
          <CardContent>
            {classesLoading ? (
              <p>Loading classes...</p>
            ) : classes?.length > 0 ? (
              <div className="space-y-4">
                {classes.slice(0, 5).map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground">Grade {cls.grade} · {cls.subject}</p>
                      </div>
                    </div>
                    <Link href={`/teacher/classes/${cls.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">No classes yet</h3>
                <p className="text-sm text-muted-foreground mb-3">You haven't created any classes yet.</p>
                <Link href="/teacher/classes/create">
                  <Button>Create Class</Button>
                </Link>
              </div>
            )}
          </CardContent>
          {(classes?.length > 0) && (
            <CardFooter>
              <Link href="/teacher/classes">
                <Button variant="outline" className="w-full">View All Classes</Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>Recently created assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {assignmentsLoading ? (
              <p>Loading assignments...</p>
            ) : assignments?.length > 0 ? (
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ListTodo className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()} · {assignment.className}
                        </p>
                      </div>
                    </div>
                    <Link href={`/teacher/assignments/${assignment.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <ListTodo className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">No assignments yet</h3>
                <p className="text-sm text-muted-foreground mb-3">You haven't created any assignments yet.</p>
                <Link href="/teacher/assignments/create">
                  <Button>Create Assignment</Button>
                </Link>
              </div>
            )}
          </CardContent>
          {(assignments?.length > 0) && (
            <CardFooter>
              <Link href="/teacher/assignments">
                <Button variant="outline" className="w-full">View All Assignments</Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Performance metrics across all your classes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {analyticsLoading ? (
              <p>Loading analytics...</p>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium text-green-700">Completion Rate</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{analytics.completionRate}%</div>
                    <div className="text-sm text-green-600">Average assignment completion</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-blue-700">Average Score</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{analytics.averageScore}%</div>
                    <div className="text-sm text-blue-600">Average student performance</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-purple-700">Active Students</h3>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{analytics.totalStudents}</div>
                    <div className="text-sm text-purple-600">Students across all classes</div>
                  </div>
                </div>
                
                <div className="w-full flex justify-center">
                  <Link href="/teacher/analytics">
                    <Button variant="outline">View Detailed Analytics</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardDescription>Your schedule for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg bg-purple-50">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-purple-800">Math 101 Class</h4>
                  <p className="text-sm text-purple-600">Today, 10:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <ListTodo className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Assignment Due</h4>
                  <p className="text-sm text-muted-foreground">Tomorrow, 11:59 PM</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Parent-Teacher Meeting</h4>
                  <p className="text-sm text-muted-foreground">Friday, 3:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/teacher/calendar">
              <Button variant="outline" className="w-full">View Full Calendar</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and tools</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/teacher/lesson-plans">
                <div className="border rounded-lg p-4 text-center hover:bg-muted flex flex-col items-center justify-center h-full">
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Lesson Plans</h3>
                  <p className="text-sm text-muted-foreground">Create and manage lessons</p>
                </div>
              </Link>
              
              <Link href="/teacher/assignments">
                <div className="border rounded-lg p-4 text-center hover:bg-muted flex flex-col items-center justify-center h-full">
                  <ListTodo className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Assignments</h3>
                  <p className="text-sm text-muted-foreground">Manage student tasks</p>
                </div>
              </Link>
              
              <Link href="/teacher/analytics">
                <div className="border rounded-lg p-4 text-center hover:bg-muted flex flex-col items-center justify-center h-full">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track student progress</p>
                </div>
              </Link>
              
              <Link href="/teacher/announcements">
                <div className="border rounded-lg p-4 text-center hover:bg-muted flex flex-col items-center justify-center h-full">
                  <MessageSquare className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Announcements</h3>
                  <p className="text-sm text-muted-foreground">Class announcements</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;