import redis from 'redis';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import ExceptionBase from '@shared/exceptions/ExceptionBase';
import HttpStatus from 'http-status-codes';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 1,
});

export default async function reteLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rateLimiter.consume(request.ip);

    return next();
  } catch {
    throw new ExceptionBase(HttpStatus.TOO_MANY_REQUESTS, 'Too many requests');
  }
}
