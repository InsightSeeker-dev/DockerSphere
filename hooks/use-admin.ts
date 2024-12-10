'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers
  };
}