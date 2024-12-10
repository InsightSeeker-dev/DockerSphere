'use client';

import { Container } from '@/components/ui/container';
import { ContainerList } from '@/components/containers/container-list';
import { CreateContainerDialog } from '@/components/containers/create-container-dialog';
import { useContainers } from '@/hooks/use-containers';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function ContainersPage() {
  const { containers, isLoading, error, refresh } = useContainers();

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Containers</h1>
          <CreateContainerDialog onSuccess={refresh} />
        </div>

        <div className="grid gap-6">
          <ContainerList 
            containers={containers} 
            isLoading={isLoading}
            error={error}
            onRefresh={refresh}
          />
        </div>
      </div>
    </Container>
  );
}