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
import AppShell from "@/components/layout/AppShell";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { LearningProvider } from "./context/LearningContext";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/lessons" component={Lessons} />
      <ProtectedRoute path="/lessons/:lessonId" component={LessonView} />
      <ProtectedRoute path="/quizzes" component={Quizzes} />
      <ProtectedRoute path="/achievements" component={Achievements} />
      <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
      <ProtectedRoute path="/downloads" component={Downloads} />
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
