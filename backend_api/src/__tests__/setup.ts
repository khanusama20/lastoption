import { beforeAll, afterAll } from 'vitest';
import { config } from '../config/env';
import { prisma } from '../config/prisma';

/**
 * Ironclad Test Database Safety Guard:
 * 1. Verifies test environment configuration.
 * 2. Parses database URL to ensure target database name strictly matches 'mydb_test' or ends in '_test'.
 * 3. Prohibits execution against 'mydb', 'postgres', or production databases.
 * 4. Queries PostgreSQL directly via 'SELECT current_database();' to verify the live database session identity.
 */
beforeAll(async () => {
  if (!config.isTest || config.nodeEnv !== 'test') {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Tests cannot run outside NODE_ENV=test. Current nodeEnv: ${config.nodeEnv}`
    );
  }

  let dbName = '';
  try {
    const parsed = new URL(config.databaseUrl);
    dbName = parsed.pathname.replace(/^\//, '');
  } catch {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Invalid DATABASE_URL format in test environment.`
    );
  }

  if (dbName === 'mydb' || dbName === 'postgres') {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Execution blocked: configured database is "${dbName}". Tests may never target development or default databases.`
    );
  }

  if (dbName !== 'mydb_test' && !dbName.endsWith('_test')) {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Execution blocked: database name "${dbName}" does not end with '_test' or match 'mydb_test'.`
    );
  }

  // Live identity check: query PostgreSQL session directly
  const rows = await prisma.$queryRawUnsafe<Array<{ current_database: string }>>(
    'SELECT current_database();'
  );
  const activeDbName = rows[0]?.current_database;

  if (!activeDbName || (activeDbName !== 'mydb_test' && !activeDbName.endsWith('_test'))) {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Live database session identity is "${activeDbName}", expected strictly "mydb_test". Tests aborted to protect development data.`
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
