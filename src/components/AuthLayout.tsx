import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-professional">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-in">
          <h1 className="text-4xl font-bold mb-2 text-professional-accent">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>
        
        <div className="bg-professional-card shadow-elevated rounded-lg p-8 animate-slide-in border border-border/50">
          {children}
        </div>
        
        <div className="text-center mt-6 animate-slide-in">
          <p className="text-sm text-muted-foreground">
            Attendance & Personal Development Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;