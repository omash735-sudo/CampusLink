// lib/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

// Cast to any to bypass type checking
export const db = drizzle(sql as any, { schema });
export * from './schema';
