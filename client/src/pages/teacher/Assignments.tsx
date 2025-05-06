import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock, 
  FileText, 
  Plus, 
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from 'date-fns';

const TeacherAssignments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterClass, setFilterClass] = React.useState('all');

  // Define proper types for our API responses
  type AssignmentType = {
    id: number;
    title: string;
    description: string;
    classId: number;
    className: string;
    dueDate: string;
    status: string;
    assignedDate: string;
    submissions?: number;
    totalStudents?: number;
  };

  type ClassType = {
    id: number;
    name: string;
  };

  // Query to get all assignments with proper type
  const { data: assignments = [], isLoading } = useQuery<AssignmentType[]>({
    queryKey: ['/api/teacher/assignments'],
    enabled: !!user?.isTeacher,
  });

  // Query to get classes for filtering
  const { data: classes = [] } = useQuery<ClassType[]>({
    queryKey: ['/api/teacher/classes'],
    enabled: !!user?.isTeacher,
  });

  // Filter assignments based on search term, status, and class
  const filteredAssignments = React.useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      
      const matchesClass = filterClass === 'all' || assignment.classId.toString() === filterClass;
      
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [assignments, searchTerm, filterStatus, filterClass]);

  // Get status badge component for a given status
  const getStatusBadge = (status: string): React.ReactNode => {
    switch(status) {
      case 'active':
        return (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-700">Active</span>
          </div>
        );
      case 'draft':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-amber-700">Draft</span>
          </div>
        );
      case 'archived':
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-700">Archived</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage assignments for your classes
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/assignments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-2">No assignments found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                No assignments match your current filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{assignment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.description.length > 60 
                            ? `${assignment.description.substring(0, 60)}...` 
                            : assignment.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{assignment.className}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.submissions !== undefined ? 
                        `${assignment.submissions}/${assignment.totalStudents}` : 
                        'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/assignments/${assignment.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/assignments/${assignment.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignments;