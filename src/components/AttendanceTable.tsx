import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X, Clock, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'present' | 'absent' | 'late';
  time: string;
  attendanceCount: number;
  totalClasses: number;
}

const AttendanceTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const attendanceResponse = await apiService.getAllAttendance();
        
        if (attendanceResponse.status === 'success' && 'attendance' in attendanceResponse) {
          // Transform backend data to frontend format
          const transformedStudents: Student[] = Object.entries(attendanceResponse.attendance).map(([studentId, studentData]) => {
            const data = studentData as any;
            const records = Array.isArray(data.records) ? data.records : [];
            const presentCount = records.filter((record: any) => record.present).length;
            const totalCount = records.length;
            
            // Determine current status based on most recent attendance
            const latestRecord = records[records.length - 1];
            let status: 'present' | 'absent' | 'late' = latestRecord?.present ? 'present' : 'absent';
            
            // Use actual time from latest record or generate mock time
            const mockTime = latestRecord?.present ? 
              (latestRecord.time ? latestRecord.time.substring(0, 5) + ' AM' : '09:15 AM') : 
              '-';
            
            return {
              id: studentId,
              name: data.student_name || `Student ${studentId}`,
              email: `${studentId.toLowerCase()}@vce.ac.in`,
              status,
              time: mockTime,
              attendanceCount: presentCount,
              totalClasses: totalCount
            };
          });
          
          setStudents(transformedStudents);
        }
      } catch (err) {
        setError('Failed to load attendance data');
        console.error('Error fetching attendance:', err);
        
        // Fallback to mock data on error
        setStudents([
          { id: 'S001', name: 'Ryan', email: 's001@vce.ac.in', status: 'present', time: '09:15 AM', attendanceCount: 2, totalClasses: 5 },
          { id: 'S002', name: 'Alex', email: 's002@vce.ac.in', status: 'absent', time: '-', attendanceCount: 1, totalClasses: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const presentCount = students.filter(s => s.status === 'present').length;
  const totalCount = students.length;

  const handleRefresh = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect to refetch data
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-glow border-primary/20 shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Class Attendance</span>
            <Loader className="h-4 w-4 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Class Attendance</span>
            {error && (
              <Button onClick={handleRefresh} variant="ghost" size="sm">
                <Clock className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            )}
          </div>
          <Badge variant="secondary" className="bg-success text-success-foreground">
            {presentCount}/{totalCount} Present
          </Badge>
        </CardTitle>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error} - Showing sample data</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Time</th>
                <th className="text-center p-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3 text-muted-foreground">{student.email}</td>
                  <td className="p-3 text-center">
                    {student.status === 'present' && (
                      <Badge className="bg-success text-success-foreground">
                        <Check className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                    )}
                    {student.status === 'absent' && (
                      <Badge variant="destructive">
                        <X className="h-3 w-3 mr-1" />
                        Absent
                      </Badge>
                    )}
                    {student.status === 'late' && (
                      <Badge className="bg-warning text-warning-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Late
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{student.time}</td>
                  <td className="p-3 text-center text-muted-foreground">
                    {student.attendanceCount}/{student.totalClasses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;