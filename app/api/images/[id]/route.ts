import { NextResponse } from 'next/server';
import { getDockerClient } from '@/lib/docker/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const docker = getDockerClient();
    const image = docker.getImage(params.id);
    await image.remove();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove image' },
      { status: 500 }
    );
  }
}