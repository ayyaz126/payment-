import { Redis as UpstashRedis } from "@upstash/redis";
import { createClient as createNodeRedisClient } from "redis";
import { ENV } from "./env";

let redis: any;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
   
  const upstash = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  redis = {
    get: async (key: string) => await upstash.get(key),
    set: async (key: string, value: string, opts?: { ex?: number }) =>
      opts?.ex ? await upstash.set(key, value, { ex: opts.ex }) : await upstash.set(key, value),
    del: async (key: string) => await upstash.del(key),
  };

  console.log(" Using Upstash Redis");
} else {
 
  const client = createNodeRedisClient({
    url: ENV.REDIS_URL || "redis://redis:6379",
  });

  client.on("connect", () => console.log(" Connected to local Redis"));
  client.on("error", (err) => console.error(" Redis error:", err));

  (async () => {
    try {
      await client.connect();
    } catch (error) {
      console.error(" Redis connection failed:", error);
    }
  })();

  redis = client;
}

export { redis };
