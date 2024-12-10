import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const containerSchema = z.object({
  name: z.string().min(1).max(100),
  image: z.string().min(1),
  dockerfile: z.string().optional(),
  customUrl: z.string().url().optional(),
  ports: z.array(z.string().regex(/^\d+:\d+$/)).optional()
});

export const validateContainer = (req: Request, res: Response, next: NextFunction) => {
  try {
    containerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid container data' });
  }
};