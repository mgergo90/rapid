import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { BaseGuard } from './base.guard';

dotenv.config();

@Injectable()
export class ApiKeyGuard extends BaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const apiKey = this.extractApiKey(
      context.switchToHttp().getRequest<Request>(),
    );
    if (!apiKey || !process.env.API_KEY?.split('|').includes(apiKey)) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return true;
  }
}
