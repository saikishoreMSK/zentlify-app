// services/redisClient.ts
import { Redis } from 'ioredis';

// Use environment variables for connection security
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
};

// Singleton pattern to ensure only one connection instance is created
let redisClient: Redis;

function getRedisClient(): Redis {
    if (!redisClient) {
        // Connection options for production stability (auto-reconnect)
        redisClient = new Redis(redisConfig);
        
        redisClient.on('error', (err) => {
            console.error('Redis Error:', err);
            // Implement robust error handling or circuit breaking here
        });

        console.log('Redis client initialized.');
    }
    return redisClient;
}

export { getRedisClient };