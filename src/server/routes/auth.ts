import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { validateRegistration, validateLogin } from '../validators/authValidator';

export const router = Router();

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret'
    );

    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret'
    );

    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});