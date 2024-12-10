import { getDockerClient } from './client';
import { prisma } from '@/lib/prisma';

interface DockerImage {
  id: string;
  name: string;
  size: number;
  created: number;
  tags: string[];
}

export async function getUserImages(userId: string): Promise<DockerImage[]> {
  const docker = getDockerClient();
  const userContainers = await prisma.container.findMany({
    where: { userId },
    select: { image: true }
  });

  const images = await docker.listImages();
  const userImages = images
    .filter(img => img.RepoTags && img.RepoTags.length > 0)
    .map(img => ({
      id: img.Id,
      name: img.RepoTags![0],
      size: img.Size,
      created: img.Created,
      tags: img.RepoTags || []
    }))
    .filter(img => 
      userContainers.some(container => container.image === img.name) ||
      img.tags.some(tag => tag.startsWith(`user_${userId}/`))
    );

  return userImages;
}

export async function pullImage(userId: string, imageName: string): Promise<void> {
  const docker = getDockerClient();
  
  try {
    await docker.pull(imageName);
    // Tag image with user ID for tracking
    const image = docker.getImage(imageName);
    await image.tag({
      repo: `user_${userId}/${imageName.split('/').pop()}`,
      tag: 'latest'
    });
  } catch (error) {
    console.error('Failed to pull image:', error);
    throw new Error('Failed to pull Docker image');
  }
}

export async function removeImage(userId: string, imageId: string): Promise<void> {
  const docker = getDockerClient();
  
  try {
    // Verify image belongs to user
    const userImages = await getUserImages(userId);
    const imageToRemove = userImages.find(img => img.id === imageId);
    
    if (!imageToRemove) {
      throw new Error('Image not found or access denied');
    }

    // Check if image is in use
    const containers = await prisma.container.findMany({
      where: { 
        userId,
        image: imageToRemove.name
      }
    });

    if (containers.length > 0) {
      throw new Error('Cannot remove image: it is being used by containers');
    }

    // Remove image
    const image = docker.getImage(imageId);
    await image.remove();
  } catch (error) {
    console.error('Failed to remove image:', error);
    throw error;
  }
}