'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { UploadIcon } from 'lucide-react';

const pullImageSchema = z.object({
  image: z.string().min(1, 'Image name is required'),
  tag: z.string().default('latest'),
});

type FormData = z.infer<typeof pullImageSchema>;

interface PullImageDialogProps {
  onSuccess: () => void;
}

export function PullImageDialog({ onSuccess }: PullImageDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(pullImageSchema),
    defaultValues: {
      image: '',
      tag: 'latest',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch('/api/images/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to pull image');
      }

      toast({
        title: 'Success',
        description: 'Image pulled successfully',
      });

      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon className="mr-2 h-4 w-4" />
          Pull Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pull Docker Image</DialogTitle>
          <DialogDescription>
            Pull a Docker image from a registry.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Input placeholder="nginx" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the image to pull (e.g., nginx, ubuntu).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="latest" {...field} />
                  </FormControl>
                  <FormDescription>
                    The tag of the image (defaults to latest).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Pull Image</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}