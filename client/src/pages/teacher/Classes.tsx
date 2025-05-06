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
  BookOpen,
  MoreVertical,
  Plus,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const TeacherClasses = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

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
    studentCount: number;
  };

  // Query to get teacher's classes with proper type
  const { data: classes = [], isLoading: classesLoading } = useQuery<ClassType[]>({
    queryKey: ['/api/teacher/classes'],
    enabled: !!user?.isTeacher,
  });

  // Filtered classes based on search term
  const filteredClasses = React.useMemo(() => {
    if (!searchTerm) return classes;
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and students
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/classes/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Class
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {classesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Card key={cls.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{cls.name}</CardTitle>
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
                        <Link href={`/teacher/classes/${cls.id}`}>View Class</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/classes/${cls.id}/edit`}>Edit Class</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/classes/${cls.id}/students`}>Manage Students</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/classes/${cls.id}/assignments`}>Assignments</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  {cls.subject} • Grade {cls.grade} • {cls.academicYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cls.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Class Code</div>
                    <div className="text-sm font-medium font-mono bg-secondary p-1 rounded">
                      {cls.classCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Students</div>
                    <div className="text-sm font-medium">{cls.studentCount || 0}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" asChild className="w-full">
                  <Link href={`/teacher/classes/${cls.id}`}>
                    View Class
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/10">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium mb-2">No matching classes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try a different search term or clear the search
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No classes yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't created any classes yet. Create your first class to get started.
              </p>
              <Button asChild>
                <Link href="/teacher/classes/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Class
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;