import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StudentSchedule from '@/components/StudentSchedule';
import AttendanceStatus from '@/components/AttendanceStatus';
import PersonalSuggestions from '@/components/PersonalSuggestions';
import StudentQRAttendance from '@/components/StudentQRAttendance';
// import DailyRoutine from '@/components/DailyRoutine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, QrCode, BarChart3, Lightbulb } from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [studentId, setStudentId] = useState<string>('S001'); // Default fallback
  const [studentName, setStudentName] = useState<string>('Student');

  useEffect(() => {
    // Get authenticated student ID from localStorage
    const authStudentId = localStorage.getItem('studentId');
    if (authStudentId) {
      setStudentId(authStudentId);
      // Simple mapping for demo - in real app, get name from API
      setStudentName(authStudentId === 'S001' ? 'gab' : authStudentId === 'S002' ? 'prabh' : 'Student');
    }
  }, []);

  return (
    <DashboardLayout 
      title="Student Dashboard" 
      userRole="student" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Good morning, {studentName}!</h2>
          <p className="text-lg text-muted-foreground">
            Ready to make today productive? Here's your personalized overview.
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="qr-attendance" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Attendance
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              My Attendance
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Today's Schedule</h3>
                <StudentSchedule studentId={studentId} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6">Attendance Overview</h3>
                <AttendanceStatus studentId={studentId} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-attendance" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Mark Attendance with QR Code</h3>
              <StudentQRAttendance 
                studentId={studentId} 
                studentName={studentName}
              />
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Detailed Attendance Records</h3>
              <AttendanceStatus studentId={studentId} />
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Personalized Development Suggestions</h3>
              <PersonalSuggestions studentId={studentId} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Section - Daily Routine */}
        {/* <div>
          <h3 className="text-2xl font-bold mb-6">Your Daily Timeline</h3>
          <DailyRoutine />
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;