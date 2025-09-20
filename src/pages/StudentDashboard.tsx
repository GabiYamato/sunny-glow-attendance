import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StudentSchedule from '@/components/StudentSchedule';
import AttendanceStatus from '@/components/AttendanceStatus';
import PersonalSuggestions from '@/components/PersonalSuggestions';
// import DailyRoutine from '@/components/DailyRoutine';
import StudentQRScanner from '@/components/StudentQRScanner';

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
      setStudentName(authStudentId === 'S001' ? 'Ryan' : 'Alex');
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

        {/* Top Section - QR Scanner and Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <StudentQRScanner />
          </div>
          <div>
            <StudentSchedule studentId={studentId} />
          </div>
          <div>
            <AttendanceStatus studentId={studentId} />
          </div>
        </div>

        {/* Middle Section - Suggestions */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Smart Suggestions & Goals</h3>
          <PersonalSuggestions studentId={studentId} />
        </div>

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