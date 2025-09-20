import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, ArrowLeft, User, BookOpen, Star } from 'lucide-react';

interface ClassStudentsProps {
  onLogout: () => void;
}

const ClassStudents = ({ onLogout }: ClassStudentsProps) => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const handleBackToClasses = () => {
    navigate('/teacher/score-management');
  };

  const handleSelectStudent = (studentId: string) => {
    navigate(`/teacher/score-management/class/${classId}/student/${studentId}`);
  };

  // Mock data for students
  const students = [
    {
      id: 'student-1',
      name: 'Rahul Sharma',
      rollNumber: '10A01',
      averageScore: 85.5,
      totalSubjects: 4,
      lastUpdated: '2025-09-18',
      performance: 'excellent'
    },
    {
      id: 'student-2',
      name: 'Priya Patel',
      rollNumber: '10A02',
      averageScore: 78.2,
      totalSubjects: 4,
      lastUpdated: '2025-09-17',
      performance: 'good'
    }
  ];

  const classInfo = {
    'class-10a': {
      name: 'Class 10-A',
      subject: 'Mathematics & Science'
    }
  };

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      average: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      needsImprovement: 'bg-red-100 text-red-800 border-red-300'
    };
    
    return variants[performance as keyof typeof variants] || variants.average;
  };

  const currentClass = classInfo[classId as keyof typeof classInfo];

  return (
    <DashboardLayout 
      title="Class Students" 
      userRole="teacher" 
      onLogout={onLogout}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                onClick={handleBackToClasses}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Classes</span>
              </Button>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {currentClass?.name} - Students
            </h2>
            <p className="text-lg text-muted-foreground">
              Select a student to manage their scores in {currentClass?.subject}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{students.length} Students</span>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <Card 
              key={student.id}
              className="bg-gradient-glow border-primary/20 shadow-warm hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => handleSelectStudent(student.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>{student.name}</span>
                  </div>
                  <Badge className={getPerformanceBadge(student.performance)}>
                    {student.performance}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-semibold">{student.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-professional-accent">
                        {student.averageScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                    <p className="font-semibold">{student.totalSubjects}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{student.lastUpdated}</p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all group-hover:shadow-warm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectStudent(student.id);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Edit Scores
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground">
              This class doesn't have any students enrolled yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassStudents;