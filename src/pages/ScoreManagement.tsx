import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, BookOpen, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface ScoreManagementProps {
  onLogout: () => void;
}

const ScoreManagement = ({ onLogout }: ScoreManagementProps) => {
  const navigate = useNavigate();
  const [allScores, setAllScores] = useState<Record<string, Record<string, number>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllScores = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllScores();
        
        if (response.status === 'success') {
          setAllScores(response.scores);
        }
      } catch (err) {
        setError('Failed to load scores data');
        console.error('Error fetching all scores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllScores();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/teacher');
  };

  const handleSelectClass = (classId: string) => {
    navigate(`/teacher/score-management/class/${classId}`);
  };

  // Calculate class statistics from real data
  const getClassStats = () => {
    if (!allScores) {
      return [
        {
          id: 'class-10a',
          name: 'Class 10-A',
          subject: 'Mathematics & Science',
          studentCount: 2,
          description: 'Advanced Mathematics and Science class'
        }
      ];
    }

    const studentCount = Object.keys(allScores).length;
    
    return [
      {
        id: 'class-10a',
        name: 'Class 10-A', 
        subject: 'All Subjects',
        studentCount,
        description: `Comprehensive class with ${studentCount} students`
      }
    ];
  };

  const classes = getClassStats();

  if (loading) {
    return (
      <DashboardLayout 
        title="Score Management" 
        userRole="teacher" 
        onLogout={onLogout}
      >
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading scores data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Score Management" 
      userRole="teacher" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                onClick={handleBackToDashboard}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h2 className="text-3xl font-bold mb-2">Select Class to Manage Scores</h2>
            <p className="text-lg text-muted-foreground">
              Choose a class to view and edit student scores
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error} - Using sample data</p>
              </div>
            )}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card 
              key={classItem.id}
              className="bg-gradient-glow border-primary/20 shadow-warm hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => handleSelectClass(classItem.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{classItem.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-professional-accent">{classItem.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">{classItem.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{classItem.studentCount} Students</span>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all group-hover:shadow-warm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectClass(classItem.id);
                  }}
                >
                  Manage Scores
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {classes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground">
              You don't have any classes assigned yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScoreManagement;