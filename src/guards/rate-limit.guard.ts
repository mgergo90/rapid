import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { BaseGuard } from './base.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RateLimitGuard extends BaseGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    const rateLimitKey = `rate-limit:${apiKey}`;
    const rateLimit = await this.cacheManager.get(rateLimitKey);
    const ttl = await this.cacheManager.ttl(rateLimitKey);
    // Check if the rate limit has been reached
    if (rateLimit && Number(rateLimit) >= 10) {
      throw new HttpException(
        'Too many requests, please try again later.',
        HttpStatus.TOO_MANY_REQUESTS, // 409 Conflict
      );
    }

    await this.cacheManager.set(
      rateLimitKey,
      Number(rateLimit ?? 0) + 1,
      ttl ?? 24 * 60 * 60,
    );

    return true;
  }
}
