import { Navbar } from '@/components/ui/navbar';
import { Toaster } from '@/components/ui/toaster';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Dashboard | WindSurf Docker Management',
  description: 'Manage your Docker containers with ease',
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
}