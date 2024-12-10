import Docker from 'dockerode';
import { logger } from '../utils/logger';

export const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

export async function checkDockerConnection(): Promise<boolean> {
  try {
    await docker.ping();
    return true;
  } catch (error) {
    logger.error('Docker connection failed:', error);
    return false;
  }
}