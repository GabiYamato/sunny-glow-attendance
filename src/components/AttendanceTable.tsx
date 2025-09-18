import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X, Clock } from 'lucide-react';

const AttendanceTable = () => {
  const students = [
    { id: 1, name: 'Alice Johnson', email: 'alice@vce.ac.in', status: 'present', time: '09:15 AM' },
    { id: 2, name: 'Bob Smith', email: 'bob@vce.ac.in', status: 'present', time: '09:12 AM' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@vce.ac.in', status: 'absent', time: '-' },
    { id: 4, name: 'Diana Prince', email: 'diana@vce.ac.in', status: 'present', time: '09:18 AM' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan@vce.ac.in', status: 'late', time: '09:25 AM' },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona@vce.ac.in', status: 'present', time: '09:10 AM' },
  ];

  const presentCount = students.filter(s => s.status === 'present').length;
  const totalCount = students.length;

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Class Attendance</span>
          </div>
          <Badge variant="secondary" className="bg-success text-success-foreground">
            {presentCount}/{totalCount} Present
          </Badge>
        </CardTitle>
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