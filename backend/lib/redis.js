import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_URL);

// redis is a key value store
await redis.set("foo", "bar");
