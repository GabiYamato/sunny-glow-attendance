import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Target, Clock } from 'lucide-react';

const PersonalSuggestions = () => {
  const suggestions = [
    {
      id: 1,
      type: 'study',
      title: 'Review Physics Chapter 3',
      description: 'You have a free period at 11:30 AM. Perfect time to review momentum and energy concepts.',
      duration: '30 mins',
      priority: 'high',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'practice',
      title: 'Complete Math Problem Set',
      description: 'Practice calculus problems before tomorrow\'s test. Use the library during lunch break.',
      duration: '45 mins',
      priority: 'high',
      icon: Target
    },
    {
      id: 3,
      type: 'personal',
      title: 'Meditation Break',
      description: 'Take 10 minutes to relax and meditate. Your stress levels have been high this week.',
      duration: '10 mins',
      priority: 'medium',
      icon: Lightbulb
    },
    {
      id: 4,
      type: 'academic',
      title: 'Join Study Group',
      description: 'Chemistry study group meets at 3:30 PM. Great opportunity to review organic compounds.',
      duration: '60 mins',
      priority: 'medium',
      icon: BookOpen
    }
  ];

  const goals = [
    { id: 1, title: 'Improve Math Grade', progress: 75, target: 'A-' },
    { id: 2, title: 'Read 2 Books This Month', progress: 50, target: '2/2 books' },
    { id: 3, title: 'Exercise 3x per Week', progress: 60, target: '3 sessions' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggestions */}
      <Card className="bg-professional-card border border-border/50 shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-professional-accent" />
            <span>Smart Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => {
              const IconComponent = suggestion.icon;
              return (
                <div key={suggestion.id} className="p-4 rounded-lg bg-card border border-border/50 hover:shadow-warm transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{suggestion.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{suggestion.duration}</span>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{suggestion.description}</p>
                  <Button size="sm" className="bg-gradient-sunny hover:shadow-warm transition-all">
                    Add to Schedule
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Personal Goals */}
      <Card className="bg-gradient-glow border-primary/20 shadow-warm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Personal Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-sunny h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalSuggestions;