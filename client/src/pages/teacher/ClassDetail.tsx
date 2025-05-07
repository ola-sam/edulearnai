import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ClipboardList,
  Edit,
  FileText,
  Mail,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

// Define types
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
  studentCount: number;
};

type StudentType = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  grade: number;
  points: number;
  avatarUrl: string | null;
};

type AssignmentType = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  classId: number;
  status: string;
};

const ClassDetail = () => {
  const params = useParams();
  const id = params.id || '';
  const classId = parseInt(id);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get class details
  const { data: classDetails, isLoading: isClassLoading } = useQuery<ClassType>({
    queryKey: [`/api/teacher/classes/${classId}`],
    queryFn: async () => {
      // Make sure classId is a number and not undefined
      if (!classId || isNaN(classId)) throw new Error('Class ID is required');
      const response = await fetch(`/api/teacher/classes/${classId}`);
      if (!response.ok) throw new Error('Failed to fetch class details');
      return response.json();
    },
    enabled: !isNaN(classId) && !!user?.isTeacher,
  });

  // Get class students
  const { data: students, isLoading: isStudentsLoading } = useQuery<StudentType[]>({
    queryKey: [`/api/teacher/classes/${classId}/students`],
    queryFn: async () => {
      if (!classId || isNaN(classId)) throw new Error('Class ID is required');
      const response = await fetch(`/api/teacher/classes/${classId}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
    enabled: !isNaN(classId) && !!user?.isTeacher,
  });

  // Get class assignments
  const { data: assignments, isLoading: isAssignmentsLoading } = useQuery<AssignmentType[]>({
    queryKey: [`/api/teacher/classes/${classId}/assignments`],
    queryFn: async () => {
      if (!classId || isNaN(classId)) throw new Error('Class ID is required');
      const response = await fetch(`/api/teacher/classes/${classId}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      return response.json();
    },
    enabled: !isNaN(classId) && !!user?.isTeacher,
  });

  // Helper function to determine if an assignment is soon due
  const isSoonDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    return due > now && (due.getTime() - now.getTime()) < threeDaysInMs;
  };

  // Loading state
  if (isClassLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/teacher/classes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="h-7 bg-gray-200 rounded-md w-40 animate-pulse"></div>
        </div>
        <div className="animate-pulse space-y-6">
          <Card>
            <CardHeader>
              <div className="h-7 bg-gray-200 rounded-md w-1/3 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded-md w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/teacher/classes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Class Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              We couldn't find the class you're looking for. It may have been deleted or you may not have permission to view it.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/teacher/classes">Back to Classes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/teacher/classes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{classDetails.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/teacher/classes/${classId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Class
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href={`/teacher/classes/${classId}/assignments/create`}>
              <FileText className="h-4 w-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">
            Students {classDetails.studentCount ? `(${classDetails.studentCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>
                {classDetails.subject} • Grade {classDetails.grade} • {classDetails.academicYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {classDetails.description || "No description provided."}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Academic Year</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{classDetails.academicYear}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Class Dates</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {new Date(classDetails.startDate).toLocaleDateString()} to{' '}
                        {new Date(classDetails.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Class Code</h3>
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                      <code className="bg-secondary p-1 rounded font-mono text-sm">
                        {classDetails.classCode}
                      </code>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/classes/${classId}/students`}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Students
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/classes/${classId}/assignments`}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Assignments
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/classes/${classId}/resources`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Class Resources
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-6">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No recent activity in this class.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 bg-muted/10">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={`/teacher/classes/${classId}/activity`}>
                    View All Activity
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {isAssignmentsLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={new Date(assignment.dueDate) < new Date() ? "destructive" : "default"}
                          className={isSoonDue(assignment.dueDate) ? "bg-orange-100 text-orange-800 hover:bg-orange-200" : ""}
                        >
                          {new Date(assignment.dueDate) < new Date() ? "Overdue" : "Upcoming"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No upcoming assignments.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 bg-muted/10">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={`/teacher/classes/${classId}/assignments`}>
                    View All Assignments
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Class Students</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher/classes/${classId}/students/invite`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Invite Students
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/teacher/classes/${classId}/students/add`}>
                      <Users className="h-4 w-4 mr-2" />
                      Add Students
                    </Link>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage students enrolled in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStudentsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded-md w-32 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded-md w-24"></div>
                        </div>
                      </div>
                      <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : students && students.length > 0 ? (
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(student.firstName, student.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{student.username}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/students/${student.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Students Enrolled</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    This class doesn't have any students enrolled yet. Share the class code or invite
                    students directly to get started.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/teacher/classes/${classId}/students/invite`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Invite Students
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/teacher/classes/${classId}/students/add`}>
                        <Users className="h-4 w-4 mr-2" />
                        Add Students
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Class Assignments</CardTitle>
                <Button asChild>
                  <Link href={`/teacher/classes/${classId}/assignments/create`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Manage assignments for this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAssignmentsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-5 bg-gray-200 rounded-md w-48 mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                        </div>
                      </div>
                      <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : assignments && assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={new Date(assignment.dueDate) < new Date() ? "destructive" : "default"}
                          className={isSoonDue(assignment.dueDate) ? "bg-orange-100 text-orange-800 hover:bg-orange-200" : ""}
                        >
                          {new Date(assignment.dueDate) < new Date() ? "Overdue" : "Upcoming"}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/assignments/${assignment.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Assignments Created</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't created any assignments for this class yet. Create your first assignment to get started.
                  </p>
                  <Button asChild>
                    <Link href={`/teacher/classes/${classId}/assignments/create`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Class Resources</CardTitle>
                <Button asChild>
                  <Link href={`/teacher/classes/${classId}/resources/add`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Resource
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Learning materials and resources for this class
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Resources Available</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't added any resources to this class yet. Add learning materials, worksheets, 
                or links to enhance your students' learning experience.
              </p>
              <Button asChild>
                <Link href={`/teacher/classes/${classId}/resources/add`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Resource
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;