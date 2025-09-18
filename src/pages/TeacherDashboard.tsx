import DashboardLayout from '@/components/DashboardLayout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import AttendanceTable from '@/components/AttendanceTable';
import AttendanceChart from '@/components/AttendanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Calendar } from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

const TeacherDashboard = ({ onLogout }: TeacherDashboardProps) => {
  // Sample data for charts
  const dailyAttendanceData = [
    { day: 'Mon', count: 22 },
    { day: 'Tue', count: 26 },
    { day: 'Wed', count: 20 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 24 },
  ];

  const attendanceRateData = [
    { day: 'Mon', rate: 79 },
    { day: 'Tue', rate: 93 },
    { day: 'Wed', rate: 71 },
    { day: 'Thu', rate: 89 },
    { day: 'Fri', rate: 86 },
  ];

  const classOverviewData = [
    { name: 'Present', value: 24, fill: '#22c55e' },
    { name: 'Absent', value: 4, fill: '#ef4444' }
  ];

  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      userRole="teacher" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Teacher! </h2>
          <p className="text-lg text-muted-foreground">
            Manage your class attendance and track student progress
          </p>
        </div>

        {/* QR Code Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <QRCodeGenerator />
          </div>
          
          {/* Interactive Charts */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Daily Attendance Bar Chart */}
              <Card className="bg-gradient-glow border-primary/20 shadow-warm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Daily Attendance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-professional-accent mb-1">24/28</div>
                  <div className="text-xs text-muted-foreground mb-3">Students Present Today</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={dailyAttendanceData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance Rate Trend Line Chart */}
              <Card className="bg-gradient-glow border-primary/20 shadow-warm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Attendance Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-professional-accent mb-1">86%</div>
                  <div className="text-xs text-muted-foreground mb-3">Weekly Average</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={attendanceRateData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide domain={[60, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [`${value}%`, 'Attendance Rate']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 1, r: 3 }}
                        activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Class Status Pie Chart */}
              <Card className="bg-gradient-glow border-primary/20 shadow-warm md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Class Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-professional-accent mb-1">28</div>
                      <div className="text-xs text-muted-foreground mb-3">Total Students</div>
                      <div className="flex space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Present: 24</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span>Absent: 4</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={classOverviewData}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
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