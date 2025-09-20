import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, TimetableEntry } from '@/services/api';
import { DEFAULT_STUDENT_ID } from '@/config/api';

interface StudentScheduleProps {
  studentId?: string;
}

const StudentSchedule = ({ studentId = DEFAULT_STUDENT_ID }: StudentScheduleProps) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStudentTimetable(studentId);
        
        if (response.status === 'success') {
          setTimetable(response.timetable);
        }
      } catch (err) {
        setError('Failed to load timetable');
        console.error('Error fetching timetable:', err);
        
        // Fallback to mock data with correct structure
        const mockTimetable: TimetableEntry[] = [
          { timetable_id: 1, day_of_week: 'Mon', subject: 'Math', teacher_id: 'T001', teacher_name: 'Dr. Smith', start_time: '09:00:00', end_time: '10:00:00' },
          { timetable_id: 2, day_of_week: 'Mon', subject: 'Physics', teacher_id: 'T002', teacher_name: 'Dr. Brown', start_time: '10:15:00', end_time: '11:15:00' },
          { timetable_id: 3, day_of_week: 'Mon', subject: 'Computer Science', teacher_id: 'T003', teacher_name: 'Dr. Taylor', start_time: '11:30:00', end_time: '12:30:00' },
          { timetable_id: 4, day_of_week: 'Mon', subject: 'English', teacher_id: 'T004', teacher_name: 'Dr. Green', start_time: '14:00:00', end_time: '15:00:00' },
        ];
        setTimetable(mockTimetable);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [studentId]);

  const getCurrentDayTimetable = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    return timetable.filter(entry => entry.day_of_week === currentDay);
  };

  const formatTime = (timeString: string) => {
    try {
      // Handle time format (HH:MM:SS to HH:MM)
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  const getClassStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (currentTime >= startMinutes && currentTime <= endMinutes) {
      return 'current';
    } else if (currentTime < startMinutes) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-success text-success-foreground">Current</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const todaysTimetable = getCurrentDayTimetable();

  if (loading) {
    return (
      <Card className="bg-gradient-glow border-primary/20 shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Today's Schedule</span>
            <Loader className="h-4 w-4 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
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
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Today's Schedule</span>
        </CardTitle>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error} - Showing sample data</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysTimetable.length > 0 ? (
            todaysTimetable.map((classItem) => {
              const status = getClassStatus(classItem.start_time, classItem.end_time);
              const timeRange = `${formatTime(classItem.start_time)} - ${formatTime(classItem.end_time)}`;
              
              return (
                <div 
                  key={classItem.timetable_id}
                  className={`p-4 rounded-lg border transition-all ${
                    status === 'current' 
                      ? 'bg-success/10 border-success shadow-glow' 
                      : 'bg-card border-border/50 hover:shadow-warm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{classItem.subject}</h3>
                    {getStatusBadge(status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{timeRange}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span>👨‍🏫 {classItem.teacher_name || classItem.teacher_id}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No classes scheduled for today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSchedule;