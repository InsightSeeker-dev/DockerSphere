import { NextResponse } from 'next/server';
import { getDockerClient } from '@/lib/docker/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string; action: string } }
) {
  const { id, action } = params;

  try {
    const docker = getDockerClient();
    const container = docker.getContainer(id);

    switch (action) {
      case 'start':
        await container.start();
        break;
      case 'stop':
        await container.stop();
        break;
      case 'remove':
        await container.remove({ force: true });
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Container ${action} error:`, error);
    return NextResponse.json(
      { error: `Failed to ${action} container` },
      { status: 500 }
    );
  }
}