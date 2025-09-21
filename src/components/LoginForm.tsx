import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { UserCircle, BookOpen } from 'lucide-react';

interface LoginFormProps {
  onLogin: (role: 'teacher' | 'student', credentials: { email?: string; studentId?: string; password: string }) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'student') {
      onLogin(selectedRole, { studentId, password });
    } else if (selectedRole === 'teacher') {
      onLogin(selectedRole, { email, password });
    }
  };

  if (!selectedRole) {
    return (
      <div className="space-y-4">
        <p className="text-center text-muted-foreground mb-6">
          Choose your role to continue
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <Card 
            className="p-6 cursor-pointer transition-all hover:shadow-elevated hover:scale-105 bg-professional-card border-border/50"
            onClick={() => setSelectedRole('teacher')}
          >
            <div className="text-center">
              <UserCircle className="h-12 w-12 mx-auto mb-3 text-professional-accent" />
              <h3 className="font-semibold text-lg">Teacher Login</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage attendance and class analytics
              </p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer transition-all hover:shadow-elevated hover:scale-105 bg-professional-card border-border/50"
            onClick={() => setSelectedRole('student')}
          >
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-lg">Student Login</h3>
              <p className="text-sm text-muted-foreground mt-1">
                View schedule and personal development
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        {selectedRole === 'teacher' ? (
          <UserCircle className="h-12 w-12 mx-auto mb-2 text-primary" />
        ) : (
          <BookOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
        )}
        <h3 className="font-semibold text-lg capitalize">{selectedRole} Login</h3>
        <button
          type="button"
          onClick={() => setSelectedRole(null)}
          className="text-sm text-muted-foreground underline mt-1"
        >
          Change role
        </button>
      </div>

      <div className="space-y-4">
        {selectedRole === 'teacher' ? (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID (e.g., S001)"
              required
              className="mt-1"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="mt-1"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-professional-accent hover:bg-professional-accent/90 text-white shadow-professional transition-all"
      >
        Sign In
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        {selectedRole === 'student' ? 
          'Use: gab, prabh, S001, or S002 with any password' : 
          'Demo credentials: any email/password combination'
        }
      </p>
    </form>
  );
};

export default LoginForm;