import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const AttendanceStatus = () => {
  const attendanceData = {
    today: 'present',
    streak: 7,
    thisWeek: { present: 4, total: 5 },
    thisMonth: { present: 18, total: 22 }
  };

  const recentAttendance = [
    { date: '2024-01-08', status: 'present', time: '09:15 AM' },
    { date: '2024-01-07', status: 'present', time: '09:12 AM' },
    { date: '2024-01-06', status: 'absent', time: '-' },
    { date: '2024-01-05', status: 'present', time: '09:18 AM' },
    { date: '2024-01-04', status: 'present', time: '09:10 AM' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-success-foreground">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">Late</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
            <h3 className="font-semibold mb-1">Today's Status</h3>
            <Badge className="bg-success text-success-foreground">Present</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Current Streak</h3>
            <p className="text-2xl font-bold text-primary">{attendanceData.streak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">%</span>
            </div>
            <h3 className="font-semibold mb-1">This Month</h3>
            <p className="text-2xl font-bold text-primary">
              {Math.round((attendanceData.thisMonth.present / attendanceData.thisMonth.total) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card className="bg-gradient-glow border-primary/20 shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Recent Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttendance.map((record, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/50">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(record.status)}
                  <span className="font-medium">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">{record.time}</span>
                  {getStatusBadge(record.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStatus;