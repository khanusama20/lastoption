import { beforeAll } from 'vitest';
import { config } from '../config/env';

// Safety Guard: Guarantee tests NEVER run against the development or production database
beforeAll(() => {
  const isDedicatedTestDb =
    config.databaseUrl.includes('test') || config.databaseUrl.includes('mydb_test');

  if (!isDedicatedTestDb) {
    throw new Error(
      `[CRITICAL TEST SAFETY GUARD] Tests are blocked from executing because the configured database is NOT a dedicated test database. Expected connection URL to contain 'test' or 'mydb_test'. Found: ${config.databaseUrl.replace(/:[^:@]+@/, ':***@')}`
    );
  }
});
