import { getDockerClient } from './client';
import { Container, Image } from 'dockerode';
import { prisma } from '@/lib/prisma';

export async function getUserStorageUsage(userId: string): Promise<number> {
  const docker = getDockerClient();
  let totalSize = 0;

  // Get all containers for this user
  const userContainers = await prisma.container.findMany({
    where: { userId }
  });

  // Get container sizes
  for (const container of userContainers) {
    const dockerContainer = await docker.getContainer(container.id);
    const info = await dockerContainer.inspect();
    // Use type assertion for Docker API response
    const containerInfo = info as any;
    const containerSize = containerInfo.SizeRootFs || 0;
    totalSize += containerSize;
  }

  // Get all images used by this user's containers
  const images = await docker.listImages();
  const userImages = images.filter(image => 
    userContainers.some(container => 
      container.image === (image.RepoTags && image.RepoTags[0])
    )
  );

  // Add image sizes
  for (const image of userImages) {
    totalSize += image.Size;
  }

  return totalSize;
}

export async function checkStorageLimit(userId: string, requiredSpace: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { storageLimit: true }
  });

  if (!user) return false;

  const currentUsage = await getUserStorageUsage(userId);
  return (currentUsage + requiredSpace) <= user.storageLimit;
}

export async function getImageSize(imageName: string): Promise<number> {
  const docker = getDockerClient();
  const images = await docker.listImages();
  const image = images.find(img => 
    img.RepoTags && img.RepoTags.includes(imageName)
  );
  return image ? image.Size : 0;
}