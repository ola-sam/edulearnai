import React from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Lessons from "@/pages/Lessons";
import LessonView from "@/pages/LessonView";
import Quizzes from "@/pages/Quizzes";
import Achievements from "@/pages/Achievements";
import LeaderboardPage from "@/pages/LeaderboardPage";
import Downloads from "@/pages/Downloads";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/LandingPage";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import AppShell from "@/components/layout/AppShell";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { LearningProvider } from "./context/LearningContext";
import { ProtectedRoute } from "./lib/protected-route";

// TeacherRoute component to protect teacher-specific routes
const TeacherRoute = ({ component: Component, ...rest }: any) => {
  const { user, isLoading } = useAuth();
  
  // Check if user is authenticated and is a teacher
  const isAuthorized = !isLoading && user && user.isTeacher === true;
  
  return (
    <Route
      {...rest}
      component={(props: any) =>
        isLoading ? (
          <div className="flex items-center justify-center h-screen">Loading...</div>
        ) : isAuthorized ? (
          <Component {...props} />
        ) : (
          // Redirect to dashboard if not a teacher
          <Dashboard />
        )
      }
    />
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/lessons" component={Lessons} />
      <ProtectedRoute path="/lessons/:lessonId" component={LessonView} />
      <ProtectedRoute path="/quizzes" component={Quizzes} />
      <ProtectedRoute path="/achievements" component={Achievements} />
      <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
      <ProtectedRoute path="/downloads" component={Downloads} />
      
      {/* Teacher routes */}
      <TeacherRoute path="/teacher/dashboard" component={TeacherDashboard} />
      <Route 
        path="/teacher/classes" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          // Using React.lazy with Suspense to handle the dynamic import properly
          const ClassesComponent = React.lazy(() => import("@/pages/teacher/Classes"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <ClassesComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      <Route 
        path="/teacher/classes/:id" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          // Using React.lazy with Suspense to handle the dynamic import properly
          const ClassDetailComponent = React.lazy(() => import("@/pages/teacher/ClassDetail"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <ClassDetailComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      <Route 
        path="/teacher/lesson-plans" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          const LessonPlansComponent = React.lazy(() => import("@/pages/teacher/LessonPlans"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <LessonPlansComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      <Route 
        path="/teacher/assignments" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          const AssignmentsComponent = React.lazy(() => import("@/pages/teacher/Assignments"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AssignmentsComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      <Route 
        path="/teacher/analytics" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          const AnalyticsComponent = React.lazy(() => import("@/pages/teacher/Analytics"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AnalyticsComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      
      <Route 
        path="/teacher/students" 
        component={(props: any) => {
          const { user, isLoading } = useAuth();
          const isAuthorized = !isLoading && user && user.isTeacher === true;
          
          if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
          if (!isAuthorized) return <Dashboard />;
          
          const StudentsComponent = React.lazy(() => import("@/pages/teacher/Students"));
          return (
            <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <StudentsComponent {...props} />
            </React.Suspense>
          );
        }}
      />
      
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LearningProvider>
          <TooltipProvider>
            <Toaster />
            <AppShell>
              <Router />
            </AppShell>
          </TooltipProvider>
        </LearningProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
