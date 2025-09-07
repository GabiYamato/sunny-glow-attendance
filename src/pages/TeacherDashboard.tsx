import DashboardLayout from '@/components/DashboardLayout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import AttendanceTable from '@/components/AttendanceTable';
import AttendanceChart from '@/components/AttendanceChart';

interface TeacherDashboardProps {
  onLogout: () => void;
}

const TeacherDashboard = ({ onLogout }: TeacherDashboardProps) => {
  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      userRole="teacher" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Professor! 👋</h2>
          <p className="text-lg text-muted-foreground">
            Manage your class attendance and track student progress
          </p>
        </div>

        {/* QR Code Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <QRCodeGenerator />
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              <div className="bg-gradient-glow border-primary/20 shadow-warm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">24</div>
                <div className="text-sm text-muted-foreground">Students Present</div>
              </div>
              <div className="bg-gradient-glow border-primary/20 shadow-warm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">86%</div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
              </div>
              <div className="bg-gradient-glow border-primary/20 shadow-warm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">28</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <AttendanceTable />

        {/* Analytics Charts */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Class Analytics</h3>
          <AttendanceChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;