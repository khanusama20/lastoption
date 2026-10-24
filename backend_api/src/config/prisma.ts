import { PrismaClient } from '@prisma/client';
import { config } from './env';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});
