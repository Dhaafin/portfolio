import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

if (process.env.TURSO_CONNECTION_URL) {
  client.execute('ALTER TABLE projects ADD COLUMN video_url text').catch(() => {});
}

export const db = drizzle(client, { schema });
