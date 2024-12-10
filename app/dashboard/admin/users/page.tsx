'use client';

import { Container } from '@/components/ui/container';
import { UserList } from '@/components/admin/user-list';
import { CreateUserDialog } from '@/components/admin/create-user-dialog';
import { useUsers } from '@/hooks/use-admin';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function UsersPage() {
  const { data: session } = useSession();
  const { users, isLoading, error, refresh } = useUsers();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <CreateUserDialog onSuccess={refresh} />
        </div>

        <div className="grid gap-6">
          <UserList 
            users={users} 
            isLoading={isLoading}
            error={error}
            onRefresh={refresh}
          />
        </div>
      </div>
    </Container>
  );
}