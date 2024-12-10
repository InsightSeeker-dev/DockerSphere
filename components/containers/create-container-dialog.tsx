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
import { PlusIcon } from 'lucide-react';

const createContainerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().min(1, 'Image is required'),
  port: z.string().regex(/^\d+$/, 'Port must be a number'),
});

type FormData = z.infer<typeof createContainerSchema>;

interface CreateContainerDialogProps {
  onSuccess: () => void;
}

export function CreateContainerDialog({ onSuccess }: CreateContainerDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: {
      name: '',
      image: '',
      port: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          port: parseInt(data.port, 10),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create container');
      }

      toast({
        title: 'Success',
        description: 'Container created successfully',
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
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Container
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Container</DialogTitle>
          <DialogDescription>
            Create a new container from a Docker image.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-app" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used as the subdomain for your container.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Docker Image</FormLabel>
                  <FormControl>
                    <Input placeholder="nginx:latest" {...field} />
                  </FormControl>
                  <FormDescription>
                    The Docker image to use for this container.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container Port</FormLabel>
                  <FormControl>
                    <Input placeholder="80" {...field} />
                  </FormControl>
                  <FormDescription>
                    The port your application listens on inside the container.
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}