'use server';

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const { email } = await request.json();

  // Configuration du transporteur
  const transporter = nodemailer.createTransport({
    host: 'gmail', // Remplacez par votre serveur SMTP
    port: 587,
    secure: false,
    auth: {
      user: 'dynastie.amoussou.etu@gmail.com', // Remplacez par votre email
      pass: 'fvdv pkvi wune aeka', // Remplacez par votre mot de passe
    },
  });

  const token = randomBytes(32).toString('hex');
  const resetLink = `http://localhost:3001/auth/reset-password?token=${token}`;

  // Envoi de l'email
  await transporter.sendMail({
    from: 'dynastie.amoussou.etu@gmail.com',
    to: email,
    subject: 'Réinitialisation du mot de passe',
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`,
    html: `<b>Cliquez sur ce lien pour réinitialiser votre mot de passe:</b> <a href="${resetLink}">Réinitialiser le mot de passe</a>`,
  });

  return NextResponse.json({ message: 'Email de réinitialisation envoyé' });
}