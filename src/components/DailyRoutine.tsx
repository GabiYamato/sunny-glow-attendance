import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Coffee, Target, Utensils } from 'lucide-react';

const DailyRoutine = () => {
  const routineItems = [
    { 
      time: '08:30', 
      type: 'personal', 
      title: 'Morning Review', 
      description: 'Quick review of today\'s classes',
      icon: BookOpen,
      duration: 15
    },
    { 
      time: '09:00', 
      type: 'class', 
      title: 'Mathematics', 
      description: 'Calculus - Dr. Smith',
      icon: BookOpen,
      duration: 60
    },
    { 
      time: '10:15', 
      type: 'class', 
      title: 'Physics', 
      description: 'Momentum & Energy - Prof. Johnson',
      icon: BookOpen,
      duration: 60
    },
    { 
      time: '11:30', 
      type: 'suggestion', 
      title: 'Study Period', 
      description: 'Review Physics Chapter 3 (Suggested)',
      icon: Target,
      duration: 30
    },
    { 
      time: '12:00', 
      type: 'personal', 
      title: 'Lunch Break', 
      description: 'Time to recharge',
      icon: Utensils,
      duration: 30
    },
    { 
      time: '12:30', 
      type: 'class', 
      title: 'Chemistry', 
      description: 'Organic Compounds - Dr. Brown',
      icon: BookOpen,
      duration: 60
    },
    { 
      time: '14:00', 
      type: 'class', 
      title: 'Literature', 
      description: 'Poetry Analysis - Ms. Davis',
      icon: BookOpen,
      duration: 60
    },
    { 
      time: '15:30', 
      type: 'suggestion', 
      title: 'Math Practice', 
      description: 'Problem set for tomorrow\'s test',
      icon: Target,
      duration: 45
    },
    { 
      time: '16:30', 
      type: 'personal', 
      title: 'Exercise', 
      description: 'Gym session',
      icon: Target,
      duration: 60
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-primary text-primary-foreground';
      case 'suggestion':
        return 'bg-accent text-accent-foreground';
      case 'personal':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string, defaultIcon: any, title: string) => {
    if (type === 'personal' && title.toLowerCase().includes('lunch')) {
      return Utensils;
    }
    return defaultIcon;
  };

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Daily Routine Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {routineItems.map((item, index) => {
              const IconComponent = item.icon;
              const currentTime = new Date();
              const itemTime = new Date();
              const [hours, minutes] = item.time.split(':').map(Number);
              itemTime.setHours(hours, minutes, 0, 0);
              
              const isCurrent = Math.abs(currentTime.getTime() - itemTime.getTime()) < 30 * 60 * 1000; // 30 minutes
              const isPast = currentTime > itemTime;
              
              return (
                <div key={index} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-4 h-4 rounded-full border-2 ${
                    isCurrent ? 'bg-primary border-primary shadow-glow' :
                    isPast ? 'bg-muted border-muted' : 'bg-card border-border'
                  }`}>
                    {isCurrent && <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>}
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 pb-6 transition-all ${
                    isCurrent ? 'transform scale-105' : ''
                  }`}>
                    <div className={`p-4 rounded-lg border transition-all ${
                      isCurrent ? 'bg-primary/10 border-primary shadow-warm' :
                      'bg-card border-border/50 hover:shadow-card'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-5 w-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium text-sm text-muted-foreground">{item.time}</span>
                          <Badge className={getTypeColor(item.type)} variant="secondary">
                            {item.type}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.duration}min
                        </Badge>
                      </div>
                      
                      <h3 className={`font-semibold mb-1 ${isCurrent ? 'text-primary' : ''}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyRoutine;