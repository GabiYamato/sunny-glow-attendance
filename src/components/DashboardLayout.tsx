import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Sun } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: 'teacher' | 'student';
  onLogout: () => void;
}

const DashboardLayout = ({ children, title, userRole, onLogout }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sun className="h-8 w-8 text-primary animate-glow" />
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="hover:shadow-warm transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-slide-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;