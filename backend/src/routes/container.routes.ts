// src/routes/container.routes.ts
import express from 'express';
import { Router } from 'express';

const router: Router = express.Router();

// Lister les conteneurs
router.get('/', (req, res) => {
  // TODO: Implémenter la liste des conteneurs
  res.status(200).json({ message: 'List of containers' });
});

// Créer un conteneur
router.post('/', (req, res) => {
  // TODO: Implémenter la création de conteneur
  res.status(201).json({ message: 'Container created successfully' });
});

// Obtenir un conteneur spécifique
router.get('/:id', (req, res) => {
  // TODO: Implémenter la récupération d'un conteneur
  res.status(200).json({ message: 'Container details' });
});

// Supprimer un conteneur
router.delete('/:id', (req, res) => {
  // TODO: Implémenter la suppression d'un conteneur
  res.status(200).json({ message: 'Container deleted successfully' });
});

export default router;
