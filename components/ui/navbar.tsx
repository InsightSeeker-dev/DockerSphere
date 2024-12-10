'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Container,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Container },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold">
                WindSurf
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-b-2 border-primary text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu */}
            {status === 'authenticated' && session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-5 w-5" />
                    <span>{session.user.name || session.user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          {status === 'authenticated' && session?.user && (
            <div className="border-t pb-3 pt-4">
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-accent"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}