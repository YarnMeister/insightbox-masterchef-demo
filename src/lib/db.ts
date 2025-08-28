import { Client } from 'pg';

// Database utility to handle PostgreSQL client reuse issues in Next.js
export async function withClient<T>(operation: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    return await operation(client);
  } finally {
    await client.end();
  }
}

// Convenience functions
export async function query(sql: string, params: unknown[] = []): Promise<unknown[]> {
  return withClient(async (client) => {
    const result = await client.query(sql, params);
    return result.rows;
  });
}

export async function queryOne(sql: string, params: unknown[] = []): Promise<unknown | null> {
  return withClient(async (client) => {
    const result = await client.query(sql, params);
    return result.rows[0] || null;
  });
}

export async function execute(sql: string, params: unknown[] = []): Promise<void> {
  return withClient(async (client) => {
    await client.query(sql, params);
  });
}
