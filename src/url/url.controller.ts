import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { QueueService } from './queue.service';

@Controller()
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly queueService: QueueService,
  ) {}

  @UseGuards(ApiKeyGuard)
  @UseGuards(RateLimitGuard)
  @Post('shorten')
  async shorten(
    @Body()
    body: {
      originalUrl: string;
      customAlias?: string;
      expiresAt?: Date;
    },
  ) {
    const alias = await this.urlService.shortenUrl(
      body.originalUrl,
      body.customAlias,
      body.expiresAt,
    );
    return { shortUrl: `${process.env.BASE_URL}/${alias}` };
  }

  @Get(':alias')
  async redirect(@Param('alias') alias: string, @Res() res: Response) {
    const url = await this.urlService.getUrl(alias);
    void this.urlService.updateAnalytics(url);
    res.redirect(url.originalUrl);
  }

  @Get('analitycs/:alias')
  async analitycs(@Param('alias') alias: string) {
    const url = await this.urlService.getUrl(alias);
    await this.queueService.addTask(url);
    return {
      totalRedirects: url.analytics?.totalRedirects ?? 0,
      lastRedirects: url.analytics?.lastRedirects ?? [],
    };
  }
}
