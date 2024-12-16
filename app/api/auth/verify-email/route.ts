import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      console.log('No token provided');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=Token is required`
      );
    }

    console.log('Verifying token:', token);

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      console.log('No user found with token:', token);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=Invalid or expired token`
      );
    }

    console.log('Found user:', user.id);

    try {
      // Mettre à jour l'utilisateur avec update
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
          verificationToken: null,
        },
      });

      console.log('User verified successfully:', user.id);

      // Rediriger vers la page de connexion avec un message de succès
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?success=Email verified successfully. You can now log in.`
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=Failed to verify email`
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth?error=An error occurred`
    );
  }
}