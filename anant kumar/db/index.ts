import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

// Fallback logic for when database isn't configured yet (to fail gracefully)
const client = connectionString ? postgres(connectionString) : null as any;

export const db = client ? drizzle(client, { schema }) : null;
