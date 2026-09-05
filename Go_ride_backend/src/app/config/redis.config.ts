/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from 'redis';
import { envVars } from './env';

export const redisClient = createClient({
    username: envVars.REDIS_USERNAME,
    password: envVars.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS_HOST,
        port: Number(envVars.REDIS_PORT),
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.log('Redis max retries reached, giving up');
                return false;
            }
            return Math.min(retries * 50, 500);
        }
    }
});

redisClient.on('error', err => {
    console.log('Redis Client Error', err.message);
});

redisClient.on('connect', () => {
    console.log('Redis connecting...');
});

redisClient.on('ready', () => {
    console.log('Redis ready!');
});

redisClient.on('end', () => {
    console.log('Redis connection ended');
});



// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar


export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Redis Connected");
        }
    } catch (error: any) {
        console.log('Redis connection failed:', error.message);
        console.log('Continuing without Redis...');
        // Don't throw error, let app continue without Redis
    }
}