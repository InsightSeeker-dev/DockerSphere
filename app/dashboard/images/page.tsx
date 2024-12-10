'use client';

import { Container } from '@/components/ui/container';
import { ImageList } from '@/components/images/image-list';
import { PullImageDialog } from '@/components/images/pull-image-dialog';
import { useImages } from '@/hooks/use-images';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';

export default function ImagesPage() {
  const { images, isLoading, error, refresh } = useImages();

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Images</h1>
          <PullImageDialog onSuccess={refresh} />
        </div>

        <div className="grid gap-6">
          <ImageList 
            images={images} 
            isLoading={isLoading}
            error={error}
            onRefresh={refresh}
          />
        </div>
      </div>
    </Container>
  );
}