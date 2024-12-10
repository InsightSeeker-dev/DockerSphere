'use client';

import { Container } from '@/components/ui/container';
import { SystemStats } from '@/components/admin/system-stats';
import { ContainerStats } from '@/components/admin/container-stats';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SystemPage() {
  const { data: session } = useSession();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">System Overview</h1>
        
        <div className="grid gap-6">
          <SystemStats />
          <ContainerStats />
        </div>
      </div>
    </Container>
  );
}