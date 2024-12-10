import { NextResponse } from 'next/server';
import { getDockerClient } from '@/lib/docker/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const pullImageSchema = z.object({
  image: z.string(),
  tag: z.string().default('latest'),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, tag } = pullImageSchema.parse(body);

    const docker = getDockerClient();
    await docker.pull(`${image}:${tag}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image pull error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to pull image' },
      { status: 500 }
    );
  }
}