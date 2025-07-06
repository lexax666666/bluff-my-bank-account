import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DRIZZLE_CLIENT } from './drizzle.constants';
import { createDrizzleClient } from '../db/database';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE_CLIENT,
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return createDrizzleClient(databaseUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_CLIENT],
})
export class DrizzleModule {}
