'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/lib/docker/types';

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchContainers() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/containers');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch containers');
      }
      
      setContainers(data.containers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContainers();
  }, []);

  return {
    containers,
    isLoading,
    error,
    refresh: fetchContainers
  };
}