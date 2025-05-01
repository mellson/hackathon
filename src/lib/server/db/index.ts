import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

// Check if DATABASE_URL is set
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Create the database client
const client = neon(env.DATABASE_URL);
export const db = drizzle(client);

/**
 * Execute a database query with retries
 * @param operation - Function that performs the database operation
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delay - Delay between retries in milliseconds (default: 1000)
 * @returns The result of the database operation
 */
export async function queryWithRetries<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);

      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt (exponential backoff)
        delay *= 2;
      }
    }
  }

  throw lastError;
}
