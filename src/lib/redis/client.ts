import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting helper
export async function checkRateLimit(
  key: string,
  limit: number,
  window: number
): Promise<{ success: boolean; remaining: number }> {
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, window);
  }

  const remaining = Math.max(0, limit - count);

  return {
    success: count <= limit,
    remaining,
  };
}

// Cache helper with TTL
export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await redis.get<T>(key);
  return value;
}

export async function cacheSet(key: string, value: unknown, ttl: number): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}
