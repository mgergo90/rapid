import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BaseGuard {
  protected extractApiKey(req: Request): string | null {
    const authorization = req.headers['authorization'];
    if (authorization) {
      return authorization;
    }
    throw new UnauthorizedException('Invalid API Key');
  }
}
