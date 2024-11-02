// src/routes/auth.routes.ts
import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// Route d'inscription
router.post('/register', (req, res) => {
  // TODO: Implémenter l'inscription
  res.status(201).json({ message: 'User registered successfully' });
});

// Route de connexion
router.post('/login', (req, res) => {
  // TODO: Implémenter la connexion
  res.status(200).json({ message: 'User logged in successfully' });
});

export default router;
