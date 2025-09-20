import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Save, BookOpen, Trophy, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface StudentScoreEditProps {
  onLogout: () => void;
}

interface Subject {
  id: string;
  name: string;
  maxScore: number;
  currentScore: number;
}

const StudentScoreEdit = ({ onLogout }: StudentScoreEditProps) => {
  const navigate = useNavigate();
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock student data - in real app, fetch from backend
  const studentData = {
    'student-1': { name: 'Rahul Sharma', rollNumber: '10A01' },
    'student-2': { name: 'Priya Patel', rollNumber: '10A02' }
  };

  const currentStudent = studentData[studentId as keyof typeof studentData] || 
    { name: `Student ${studentId}`, rollNumber: studentId || 'N/A' };

  useEffect(() => {
    const fetchStudentScores = async () => {
      if (!studentId) return;
      
      try {
        setLoading(true);
        const response = await apiService.getStudentScores(studentId);
        
        if (response.status === 'success') {
          // Transform API response to subject format
          const transformedSubjects: Subject[] = Object.entries(response.scores).map(([subject, score]) => ({
            id: subject.toLowerCase().replace(/\s+/g, '-'),
            name: subject,
            maxScore: 100,
            currentScore: typeof score === 'number' ? score : 0
          }));
          
          setSubjects(transformedSubjects);
        }
      } catch (err) {
        setError('Failed to load student scores');
        console.error('Error fetching scores:', err);
        
        // Fallback to mock data
        setSubjects([
          { id: 'math', name: 'Mathematics', maxScore: 100, currentScore: 88 },
          { id: 'science', name: 'Science', maxScore: 100, currentScore: 92 },
          { id: 'english', name: 'English', maxScore: 100, currentScore: 79 },
          { id: 'physics', name: 'Physics', maxScore: 100, currentScore: 85 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentScores();
  }, [studentId]);

  const handleBackToStudents = () => {
    navigate(`/teacher/score-management/class/${classId}`);
  };

  const handleScoreChange = (subjectId: string, newScore: string) => {
    const score = parseInt(newScore) || 0;
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, currentScore: Math.min(Math.max(score, 0), subject.maxScore) }
          : subject
      )
    );
  };

  const handleSaveScores = async () => {
    if (!studentId) return;
    
    setIsSaving(true);
    
    try {
      // Prepare scores for API
      const scoresData = subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.currentScore;
        return acc;
      }, {} as Record<string, number>);
      
      const response = await apiService.enterScores(studentId, scoresData);
      
      if (response.status === 'success') {
        setIsEditing(false);
        toast({
          title: "Scores Updated Successfully",
          description: `Updated scores for ${currentStudent.name}`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save scores. Please try again.",
        variant: "destructive",
      });
      console.error('Error saving scores:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateAverage = () => {
    if (subjects.length === 0) return '0.0';
    const total = subjects.reduce((sum, subject) => sum + subject.currentScore, 0);
    return (total / subjects.length).toFixed(1);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { text: 'Excellent', class: 'bg-green-100 text-green-800 border-green-300' };
    if (percentage >= 75) return { text: 'Good', class: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (percentage >= 60) return { text: 'Average', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { text: 'Needs Improvement', class: 'bg-red-100 text-red-800 border-red-300' };
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Edit Student Scores" 
        userRole="teacher" 
        onLogout={onLogout}
      >
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBackToStudents} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Loading student scores...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Edit Student Scores" 
      userRole="teacher" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                onClick={handleBackToStudents}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Students</span>
              </Button>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Edit Scores - {currentStudent?.name}
            </h2>
            <p className="text-lg text-muted-foreground">
              Roll Number: {currentStudent?.rollNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-professional-accent">
                {calculateAverage()}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Current Average</p>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="bg-gradient-glow border-primary/20 shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Student Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-semibold">{currentStudent?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-semibold">{currentStudent?.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="font-semibold">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scores Section */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Subject Scores</h3>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-professional-accent hover:bg-professional-accent/90 text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Edit Scores
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveScores}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const performance = getPerformanceBadge(subject.currentScore, subject.maxScore);
            
            return (
              <Card key={subject.id} className="bg-white border border-border/50 shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>{subject.name}</span>
                    <Badge className={performance.class}>
                      {performance.text}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor={`score-${subject.id}`}>
                        Score (Max: {subject.maxScore})
                      </Label>
                      <Input
                        id={`score-${subject.id}`}
                        type="number"
                        min="0"
                        max={subject.maxScore}
                        value={subject.currentScore}
                        onChange={(e) => handleScoreChange(subject.id, e.target.value)}
                        className="text-lg font-semibold text-center"
                      />
                      {subject.currentScore > subject.maxScore && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Score cannot exceed maximum</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(subject.currentScore, subject.maxScore)}`}>
                        {subject.currentScore}
                      </div>
                      <div className="text-muted-foreground">
                        out of {subject.maxScore}
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-muted-foreground">
                          {((subject.currentScore / subject.maxScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentScoreEdit;