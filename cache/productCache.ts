// cache/productCache.ts
import { getRedisClient } from '@/services/redisClient';

const FIVE_HOURS = 60 * 60 * 5; // Cache lifetime for affiliate data (5 hours)

// Generic function to retrieve data from cache
export async function getCacheData<T>(key: string): Promise<T | null> {
    try {
        const redis = getRedisClient();
        const cached = await redis.get(key);
        if (cached) {
            console.log(`Cache HIT for key: ${key}`);
            return JSON.parse(cached) as T;
        }
    } catch (error) {
        console.error(`Error reading cache for ${key}:`, error);
        // Fail gracefully and allow data fetching to proceed
    }
    return null;
}

// Generic function to set data into cache
export async function setCacheData(key: string, data: any, expirationSeconds: number = FIVE_HOURS): Promise<void> {
    try {
        const redis = getRedisClient();
        // Use EX (expiration) parameter to set the TTL
        await redis.set(key, JSON.stringify(data), 'EX', expirationSeconds);
        console.log(`Cache SET for key: ${key}, TTL: ${expirationSeconds}s`);
    } catch (error) {
        console.error(`Error writing cache for ${key}:`, error);
    }
}

// Example specific cache utility (Products/Category data)
export function getProductKey(categorySlug: string): string {
    return `products:${categorySlug}`;
}