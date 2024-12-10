import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(error.stack);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(500).json({ error: 'Internal server error' });
};