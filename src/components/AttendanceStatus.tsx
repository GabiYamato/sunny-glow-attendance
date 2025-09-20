import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Calendar, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, AttendanceRecord } from '@/services/api';
import { DEFAULT_STUDENT_ID } from '@/config/api';

interface AttendanceStatusProps {
  studentId?: string;
}

const AttendanceStatus = ({ studentId = DEFAULT_STUDENT_ID }: AttendanceStatusProps) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStudentAttendance(studentId);
        
        if (response.status === 'success') {
          setAttendanceRecords(response.records);
        }
      } catch (err) {
        setError('Failed to load attendance status');
        console.error('Error fetching attendance status:', err);
        
        // Fallback to mock data
        setAttendanceRecords([
          { attendance_id: 1, class_id: 1, student_id: 'S001', present: true, subject: 'Math', date: '2025-09-15', time: '09:00:00' },
          { attendance_id: 2, class_id: 2, student_id: 'S001', present: false, subject: 'Physics', date: '2025-09-16', time: '10:00:00' },
          { attendance_id: 3, class_id: 3, student_id: 'S001', present: true, subject: 'Computer Science', date: '2025-09-17', time: '11:00:00' },
          { attendance_id: 4, class_id: 4, student_id: 'S001', present: true, subject: 'English', date: '2025-09-18', time: '09:00:00' },
        ] as any);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, [studentId]);

  const calculateStats = () => {
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.present).length;
    const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    
    // Calculate streak (consecutive present days from most recent)
    let streak = 0;
    for (let i = attendanceRecords.length - 1; i >= 0; i--) {
      if (attendanceRecords[i].present) {
        streak++;
      } else {
        break;
      }
    }

    // Get today's status (assume most recent record)
    const todayStatus = attendanceRecords.length > 0 
      ? (attendanceRecords[attendanceRecords.length - 1].present ? 'present' : 'absent')
      : 'unknown';

    return {
      todayStatus,
      streak,
      attendanceRate,
      presentCount,
      totalClasses
    };
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 bg-muted rounded mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-1"></div>
                <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Loading attendance...</span>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = calculateStats();

  // Generate recent attendance display from API data
  const recentAttendance = attendanceRecords.slice(-5).map((record, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (4 - index)); // Last 5 days
    
    return {
      date: date.toISOString().split('T')[0],
      status: record.present ? 'present' : 'absent',
      time: record.present ? '09:15 AM' : '-'
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">{error} - Showing sample data</p>
        </div>
      )}
      
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            {stats.todayStatus === 'present' ? (
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
            ) : (
              <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            )}
            <h3 className="font-semibold mb-1">Today's Status</h3>
            {getStatusBadge(stats.todayStatus)}
          </CardContent>
        </Card>

        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Current Streak</h3>
            <p className="text-2xl font-bold text-primary">{stats.streak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">%</span>
            </div>
            <h3 className="font-semibold mb-1">Overall Rate</h3>
            <p className="text-2xl font-bold text-primary">{stats.attendanceRate}%</p>
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
            {recentAttendance.length > 0 ? (
              recentAttendance.map((record, index) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStatus;