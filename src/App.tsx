import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import ScoreManagement from "./pages/ScoreManagement";
import ClassStudents from "./pages/ClassStudents";
import StudentScoreEdit from "./pages/StudentScoreEdit";

const queryClient = new QueryClient();

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/teacher" element={<TeacherDashboard onLogout={handleLogout} />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard onLogout={handleLogout} />} />
            <Route path="/teacher/score-management" element={<ScoreManagement onLogout={handleLogout} />} />
            <Route path="/teacher/score-management/class/:classId" element={<ClassStudents onLogout={handleLogout} />} />
            <Route path="/teacher/score-management/class/:classId/student/:studentId" element={<StudentScoreEdit onLogout={handleLogout} />} />
            <Route path="/student-dashboard" element={<StudentDashboard onLogout={handleLogout} />} />
            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
