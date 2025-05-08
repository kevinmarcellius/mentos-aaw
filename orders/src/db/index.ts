import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createClient } from "redis";

const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = (process.env.DB_PORT as number | undefined) ?? 5432;
const DB_USER = process.env.DB_USER ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? "postgres"
const DB_NAME = process.env.DB_NAME ?? "postgres"

export const pool = new Pool({
  connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
});

export const db = drizzle(pool);
const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
const REDIS_PORT = (process.env.REDIS_PORT as number | undefined) ?? 6379;

export const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();
