import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/LoginForm';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (role: 'teacher' | 'student', credentials: { email: string; password: string }) => {
    // Simulate login - in real app, this would make API call
    toast({
      title: "Login Successful! 🎉",
      description: `Welcome back! Redirecting to ${role} dashboard...`,
    });

    // Store user role in localStorage for demo
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');

    // Redirect to appropriate dashboard
    setTimeout(() => {
      navigate(`/${role}-dashboard`);
    }, 1500);
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