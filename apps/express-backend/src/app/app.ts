import express, { Application } from 'express';
import cors from 'cors';
import { initializeDatabase } from './core/database/database';
import {
  loggingMiddleware,
  Logger,
} from './core/middleware/logging.middleware';
import healthRoutes from './core/health/health.routes';
import taskRoutes from './feature/task/task.routes';

export async function createApp(): Promise<Application> {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggingMiddleware);

  // Initialize database
  await initializeDatabase();

  // Routes
  app.use('/health', healthRoutes);
  app.use('/tasks', taskRoutes);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      Logger.error(err.message, err.stack, 'ErrorHandler');
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'dev' ? err.message : undefined,
      });
    },
  );

  return app;
}
