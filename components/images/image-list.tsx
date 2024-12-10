'use client';

import { DockerImage } from '@/lib/docker/types';
import { ImageCard } from './image-card';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

interface ImageListProps {
  images: DockerImage[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function ImageList({ 
  images, 
  isLoading, 
  error, 
  onRefresh 
}: ImageListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-medium">No images found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by pulling a Docker image.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <ImageCard 
          key={image.Id} 
          image={image}
          onRemove={onRefresh}
        />
      ))}
    </div>
  );
}