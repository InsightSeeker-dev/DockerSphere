'use client';

import { useState } from 'react';
import { DockerImage } from '@/lib/docker/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatBytes } from '@/lib/utils';
import { TrashIcon, BoxIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ImageCardProps {
  image: DockerImage;
  onRemove: () => void;
}

export function ImageCard({ image, onRemove }: ImageCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/images/${image.Id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove image');
      }

      toast({
        title: 'Success',
        description: 'Image removed successfully',
      });

      onRemove();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const tags = image.RepoTags?.filter(tag => tag !== '<none>:<none>') || [];
  const shortId = image.Id.substring(7, 19);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          {tags[0] || shortId}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-medium">{shortId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium">{formatBytes(image.Size)}</span>
          </div>
          {tags.length > 1 && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isLoading}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the
                  image from your system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-destructive text-destructive-foreground"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}