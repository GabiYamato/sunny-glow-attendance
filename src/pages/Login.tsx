import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/LoginForm';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'teacher' | 'student', credentials: { email?: string; studentId?: string; password: string }) => {
    setIsLoading(true);
    
    try {
      if (role === 'student' && credentials.studentId) {
        // Call student login API
        const response = await apiService.loginStudent({
          student_id: credentials.studentId,  // Map to backend field name
          password: credentials.password
        });
        
        if (response.status === 'success') {
          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${credentials.studentId}! Redirecting to student dashboard...`,
          });

          // Store user info in localStorage
          localStorage.setItem('userRole', role);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('studentId', credentials.studentId);

          // Redirect to student dashboard
          setTimeout(() => {
            navigate('/student-dashboard');
          }, 1500);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } else if (role === 'teacher') {
        // For teachers, simulate login for now
        toast({
          title: "Login Successful! 🎉",
          description: "Welcome back! Redirecting to teacher dashboard...",
        });

        localStorage.setItem('userRole', role);
        localStorage.setItem('isAuthenticated', 'true');

        setTimeout(() => {
          navigate('/teacher-dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="EduTrack" 
      subtitle="Attendance & Personal Development Platform"
    >
      <LoginForm onLogin={handleLogin} />
    </AuthLayout>
  );
};

export default Login;