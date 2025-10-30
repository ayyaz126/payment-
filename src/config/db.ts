import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "./env";

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ Neon ko SSL chahiye
  },
});

export const db = drizzle(pool);
export { pool };
