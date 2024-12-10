import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { hash, compare } from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const updates: any = {};

    // Handle basic fields
    ['name', 'email', 'bio'].forEach(field => {
      const value = formData.get(field);
      if (value) updates[field] = value;
    });

    // Handle password change
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (currentPassword && newPassword && confirmPassword) {
      const user = await db.user.findUnique({
        where: { id: session.user.id as string },
        select: { password: true },
      });

      const isValid = await compare(currentPassword as string, user!.password);
      if (!isValid) {
        return new NextResponse('Invalid current password', { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return new NextResponse('Passwords do not match', { status: 400 });
      }

      updates.password = await hash(newPassword as string, 12);
    }

    // Handle avatar upload
    const avatar = formData.get('avatar') as File;
    if (avatar) {
      // Here you would typically:
      // 1. Upload the file to a storage service (e.g., S3)
      // 2. Get the URL of the uploaded file
      // 3. Save the URL to the database
      // For now, we'll skip this part
    }

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: session.user.id as string },
      data: updates,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Settings update error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}