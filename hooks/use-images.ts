'use client';

import { useState, useEffect } from 'react';
import { DockerImage } from '@/lib/docker/types';

export function useImages() {
  const [images, setImages] = useState<DockerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchImages() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/images');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images');
      }
      
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    error,
    refresh: fetchImages
  };
}