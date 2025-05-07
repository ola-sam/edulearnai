import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  Search, 
  UserPlus, 
  Download,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Define our student type
type Student = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  grade: number;
  points: number;
  enrollmentId: number;
  classId: number;
  className: string;
};

const TeacherStudents = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Student;
    direction: 'ascending' | 'descending';
  }>({ key: 'lastName', direction: 'ascending' });

  // Fetch students data
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['/api/teacher/students'],
    enabled: !!user?.isTeacher,
  });

  // Get unique class names for filter dropdown
  const uniqueClasses = React.useMemo(() => {
    const classNames = students.map(student => student.className);
    // Filter for unique values
    return classNames.filter((value, index, self) => 
      self.indexOf(value) === index
    );
  }, [students]);

  // Handle sorting
  const requestSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedAndFilteredStudents = React.useMemo(() => {
    let filteredStudents = [...students];
    
    // Apply class filter
    if (classFilter !== "all") {
      filteredStudents = filteredStudents.filter(
        student => student.className === classFilter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredStudents = filteredStudents.filter(
        student => 
          student.firstName.toLowerCase().includes(lowerSearchTerm) || 
          student.lastName.toLowerCase().includes(lowerSearchTerm) ||
          student.username.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply sorting
    return filteredStudents.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [students, sortConfig, searchTerm, classFilter]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and view all students across your classes
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Total: {sortedAndFilteredStudents.length} students
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={classFilter} 
                onValueChange={setClassFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-center">
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            </div>
          ) : sortedAndFilteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => requestSort('lastName')} className="cursor-pointer">
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead onClick={() => requestSort('grade')} className="cursor-pointer">
                      <div className="flex items-center">
                        Grade
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('className')} className="cursor-pointer">
                      <div className="flex items-center">
                        Class
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('points')} className="cursor-pointer">
                      <div className="flex items-center">
                        Points
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredStudents.map((student) => (
                    <TableRow key={`${student.id}-${student.enrollmentId}`}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.points}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStudents;