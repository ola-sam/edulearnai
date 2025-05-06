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
      <TeacherRoute path="/teacher/classes" component={() => import("@/pages/teacher/Classes").then(m => m.default)} />
      <TeacherRoute path="/teacher/lesson-plans" component={() => import("@/pages/teacher/LessonPlans").then(m => m.default)} />
      
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
