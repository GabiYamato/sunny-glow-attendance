import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Target, Clock, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface PersonalSuggestionsProps {
  studentId?: string;
}

const PersonalSuggestions = ({ studentId = "STU001" }: PersonalSuggestionsProps) => {
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStudentSuggestions(studentId);
        if (response.status === 'success') {
          setApiSuggestions(response.top_suggestions || []);
        }
      } catch (err) {
        setError('Failed to load suggestions');
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [studentId]);

  // Generate detailed suggestions based on API data
  const generateDetailedSuggestions = (subjects: string[]) => {
    const subjectDescriptions: Record<string, { description: string; duration: string; priority: string; icon: typeof BookOpen }> = {
      'Math': {
        description: 'Focus on strengthening your mathematical foundations. Practice problem-solving techniques during your free periods.',
        duration: '45 mins',
        priority: 'high',
        icon: Target
      },
      'Physics': {
        description: 'Review fundamental concepts and work on problem-solving. Consider joining study groups for better understanding.',
        duration: '60 mins',
        priority: 'high',
        icon: BookOpen
      },
      'Computer Science': {
        description: 'Practice coding problems and review algorithmic concepts. Build projects to strengthen practical skills.',
        duration: '90 mins',
        priority: 'high',
        icon: BookOpen
      },
      'English': {
        description: 'Improve language skills through reading and writing practice. Focus on grammar and communication.',
        duration: '30 mins',
        priority: 'medium',
        icon: BookOpen
      },
      'Chemistry': {
        description: 'Review chemical equations and practice lab techniques. Focus on understanding reaction mechanisms.',
        duration: '50 mins',
        priority: 'medium',
        icon: BookOpen
      }
    };

    return subjects.map((subject, index) => ({
      id: index + 1,
      type: 'study',
      title: `Focus on ${subject}`,
      description: subjectDescriptions[subject]?.description || `Improve your understanding of ${subject} concepts and practice regularly.`,
      duration: subjectDescriptions[subject]?.duration || '45 mins',
      priority: subjectDescriptions[subject]?.priority || 'medium',
      icon: subjectDescriptions[subject]?.icon || BookOpen
    }));
  };

  const suggestions = loading ? [] : generateDetailedSuggestions(apiSuggestions);

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
            <span>Academic goal suggestions</span>
            {loading && <Loader className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-card border border-border/50 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
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
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No specific suggestions available at the moment.</p>
              <p className="text-sm">Keep up the great work!</p>
            </div>
          )}
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