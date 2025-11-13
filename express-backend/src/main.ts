/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { createApp } from './app/app';
import { Logger } from './app/core/middleware/logging.middleware';

// Use top-level await
try {
  const app = await createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  });
} catch (error) {
  Logger.error(
    'Failed to start application',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
}
