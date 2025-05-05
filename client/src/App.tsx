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
import AppShell from "@/components/layout/AppShell";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { UserProvider } from "./context/UserContext";
import { LearningProvider } from "./context/LearningContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lessons/:lessonId" component={LessonView} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/downloads" component={Downloads} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LearningProvider>
          <TooltipProvider>
            <Toaster />
            <AppShell>
              <Router />
            </AppShell>
          </TooltipProvider>
        </LearningProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
