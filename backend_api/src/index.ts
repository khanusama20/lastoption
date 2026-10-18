import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`[Last Option Backend API] Server running on http://localhost:${config.port}`);
  console.log(`[Last Option Backend API] Environment: ${config.nodeEnv}`);
  console.log(`[Last Option Backend API] Health check at http://localhost:${config.port}/api/v1/health`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
