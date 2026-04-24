import { Logger, Provider } from '@nestjs/common';
import mongoose from 'mongoose';

export const makeDatabaseProvider = (): Provider[] => [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const logger = new Logger('DatabaseProvider');
      const uri = process.env.DATABASE_HOST;

      if (!uri) {
        throw new Error('DATABASE_HOST environment variable is not defined');
      }

      try {
        const connection = await mongoose.connect(uri);
        logger.log(`[MONGO_DB] Database connected successfully`);
        return connection;
      } catch (error) {
        logger.error('[MONGO_DB] Failed to connect to database', error);
        throw error;
      }
    },
  },
];
