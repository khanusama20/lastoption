import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';

const server = app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.nodeEnv },
    `[Last Option Backend API] Server running on http://localhost:${config.port}`
  );
  logger.info(
    `[Last Option Backend API] Health check at http://localhost:${config.port}/api/v1/health`
  );
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
