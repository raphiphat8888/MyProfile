const { createApp } = require('./src/app');
const { closePool, testDatabaseConnection } = require('./src/config/db');
const { env } = require('./src/config/env');
const { logger } = require('./src/utils/logger');

async function startServer() {
  await testDatabaseConnection();

  const app = createApp();
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`API listening on http://0.0.0.0:${env.PORT}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received; shutting down`);

    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

startServer().catch((error) => {
  logger.error('API startup failed', error);
  process.exit(1);
});
