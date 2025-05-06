import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  BarChart3,
  BookOpen,
  CheckCircle2,
  Users,
  Clock,
  TrendingUp,
  FileCheck,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

const TeacherAnalytics = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = React.useState('all');
  const [timeRange, setTimeRange] = React.useState('month');

  // Define proper types for our API responses
  type ClassType = {
    id: number;
    name: string;
  };

  type AnalyticsType = {
    totalStudents: number;
    averageScore: number;
    completionRate: number;
    subjectPerformance: {
      subject: string;
      averageScore: number;
    }[];
    weeklyActivity: {
      week: string;
      assignments: number;
      submissions: number;
    }[];
    gradeDistribution: {
      gradeRange: string;
      count: number;
    }[];
    skillMastery: {
      skill: string;
      mastery: number;
    }[];
  };

  // Query to get classes for filtering
  const { data: classes = [] } = useQuery<ClassType[]>({
    queryKey: ['/api/teacher/classes'],
    enabled: !!user?.isTeacher,
  });

  // Query to get analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsType>({
    queryKey: ['/api/teacher/analytics', { classId: selectedClass, timeRange }],
    enabled: !!user?.isTeacher,
  });

  const defaultAnalytics: AnalyticsType = {
    totalStudents: 0,
    averageScore: 0,
    completionRate: 0,
    subjectPerformance: [],
    weeklyActivity: [],
    gradeDistribution: [],
    skillMastery: []
  };

  const data = analytics || defaultAnalytics;

  // Colors for charts
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track student performance and class metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Students" 
              value={data.totalStudents.toString()} 
              icon={<Users className="h-4 w-4" />} 
              description="Enrolled students" 
              trend={null}
            />
            
            <StatsCard 
              title="Average Score" 
              value={`${data.averageScore.toFixed(1)}%`} 
              icon={<Award className="h-4 w-4" />} 
              description="Across all assignments" 
              trend={"+2.5%"}
            />
            
            <StatsCard 
              title="Completion Rate" 
              value={`${data.completionRate.toFixed(1)}%`} 
              icon={<CheckCircle2 className="h-4 w-4" />} 
              description="Assignment submissions" 
              trend={"+5.2%"}
            />
            
            <StatsCard 
              title="Active Time" 
              value="32.5 min" 
              icon={<Clock className="h-4 w-4" />} 
              description="Avg. time per session" 
              trend={"-1.8%"}
            />
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                    <CardDescription>Assignment and submission trends</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.weeklyActivity}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="assignments" fill="#8884d8" name="Assignments" />
                        <Bar dataKey="submissions" fill="#82ca9d" name="Submissions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                    <CardDescription>Student performance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="gradeRange"
                        >
                          {data.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.subjectPerformance}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Detailed student performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-60">
                    <p className="text-muted-foreground">Detailed performance metrics will be available here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                  <CardDescription>Activity and participation metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-60">
                    <p className="text-muted-foreground">Engagement analytics will be available here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Mastery Analysis</CardTitle>
                  <CardDescription>Subject and topic mastery by students</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.skillMastery}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="skill" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mastery" fill="#8884d8" name="Mastery %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: string | null;
}

const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="p-2">
          <div className={`text-xs flex items-center ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend.startsWith('+') ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            )}
            {trend} from previous period
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TeacherAnalytics;