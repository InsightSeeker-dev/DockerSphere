'use client';

import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { Container } from '@/components/ui/container';
import { ServerIcon } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ServerIcon className="h-6 w-6" />
            <span className="font-bold">Docker Management</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </Container>
    </header>
  );
}