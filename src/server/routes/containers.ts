import { Router } from 'express';
import { auth } from '../middleware/auth';
import { ContainerService } from '../services/containerService';
import { validateContainer } from '../validators/containerValidator';

export const router = Router();
const containerService = new ContainerService();

router.post('/', auth, validateContainer, async (req: any, res) => {
  try {
    const container = await containerService.createContainer(req.user.id, req.body);
    res.status(201).json(container);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/:id/start', auth, async (req: any, res) => {
  try {
    const container = await containerService.startContainer(req.params.id, req.user.id);
    res.json(container);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/:id/stop', auth, async (req: any, res) => {
  try {
    const container = await containerService.stopContainer(req.params.id, req.user.id);
    res.json(container);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', auth, async (req: any, res) => {
  try {
    await containerService.deleteContainer(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});