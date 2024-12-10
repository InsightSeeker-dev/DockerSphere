import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as authRouter } from './routes/auth';
import { router as containerRouter } from './routes/containers';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/containers', containerRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});