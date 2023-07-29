import { Global, Logger, Module } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../../drizzle/schema';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { InferModel } from 'drizzle-orm';

export const DRIZZLE_TOKEN = Symbol('PG_CONNECTION');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_TOKEN,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(DrizzleModule.name);
        const username = configService.getOrThrow('POSTGRES_USER');
        const password = configService.getOrThrow('POSTGRES_PASSWORD');
        const host = configService.getOrThrow('POSTGRES_HOST');
        const database = configService.getOrThrow('POSTGRES_DB');

        const client = new Client({
          user: username,
          password,
          host,
          database,
        });

        await client.connect();
        logger.log('Connected to database');
        const db = drizzle(client, { schema });
        await migrate(db, { migrationsFolder: './drizzle' });
        logger.log('Migrated database');
        return db;
      },
    },
  ],
  exports: [DRIZZLE_TOKEN],
})
export class DrizzleModule {}

export type DrizzleDatabase = NodePgDatabase<typeof schema>;

export type User = InferModel<typeof schema.user, 'select'>;
export type NewUser = InferModel<typeof schema.user, 'insert'>;

export type Event = InferModel<typeof schema.event, 'select'>;
export type NewEvent = InferModel<typeof schema.event, 'insert'>;

export type Rsvp = InferModel<typeof schema.rsvp, 'select'>;
export type NewRsvp = InferModel<typeof schema.rsvp, 'insert'>;

export type Scancode = InferModel<typeof schema.scancode, 'select'>;
export type NewScancode = InferModel<typeof schema.scancode, 'insert'>;

export type RSVPStatus = NewRsvp['status'];
export type EventTypes = NewEvent['type'];
