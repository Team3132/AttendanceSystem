import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
  },
} satisfies Config;
