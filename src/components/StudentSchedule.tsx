import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

const StudentSchedule = () => {
  const currentTime = new Date();
  const schedule = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      teacher: 'Dr. Smith', 
      time: '09:00 - 10:00', 
      room: 'Room 101',
      status: 'current',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 9, 0)
    },
    { 
      id: 2, 
      subject: 'Physics', 
      teacher: 'Prof. Johnson', 
      time: '10:15 - 11:15', 
      room: 'Lab 201',
      status: 'upcoming',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 10, 15)
    },
    { 
      id: 3, 
      subject: 'Free Period', 
      teacher: '-', 
      time: '11:30 - 12:30', 
      room: '-',
      status: 'free',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 11, 30)
    },
    { 
      id: 4, 
      subject: 'Chemistry', 
      teacher: 'Dr. Brown', 
      time: '12:30 - 13:30', 
      room: 'Lab 301',
      status: 'upcoming',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 12, 30)
    },
    { 
      id: 5, 
      subject: 'Literature', 
      teacher: 'Ms. Davis', 
      time: '14:00 - 15:00', 
      room: 'Room 205',
      status: 'upcoming',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 14, 0)
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-success text-success-foreground">Current</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'free':
        return <Badge className="bg-accent text-accent-foreground">Free Period</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Today's Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((class_item) => (
            <div 
              key={class_item.id}
              className={`p-4 rounded-lg border transition-all ${
                class_item.status === 'current' 
                  ? 'bg-success/10 border-success shadow-glow' 
                  : 'bg-card border-border/50 hover:shadow-warm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{class_item.subject}</h3>
                {getStatusBadge(class_item.status)}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{class_item.time}</span>
                </div>
                
                {class_item.teacher !== '-' && (
                  <div className="flex items-center space-x-1">
                    <span>👨‍🏫 {class_item.teacher}</span>
                  </div>
                )}
                
                {class_item.room !== '-' && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{class_item.room}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSchedule;