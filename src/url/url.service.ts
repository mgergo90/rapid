import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async shortenUrl(
    originalUrl: string,
    customAlias?: string,
    expiresAt?: Date,
  ): Promise<string> {
    const alias = customAlias || nanoid(6);
    const existingUrl = await this.urlModel.findOne({ alias });
    if (existingUrl) throw new ConflictException('Alias already in use');
    await this.urlModel.create({
      originalUrl,
      alias,
      createdAt: new Date(),
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return alias;
  }

  async getUrl(alias: string): Promise<Url> {
    const url = await this.urlModel.findOne({ alias });
    if (!url || new Date() > url.expiresAt) {
      throw new NotFoundException('URL not found or expired');
    }
    return url;
  }

  async updateAnalytics(url: Url): Promise<void> {
    if (!url.analytics) {
      url.analytics = {
        totalRedirects: 0,
        lastRedirects: [],
      };
    }
    url.analytics.totalRedirects = url.analytics.totalRedirects + 1;
    url.analytics.lastRedirects = [
      new Date(),
      ...(url.analytics.lastRedirects || []),
    ];
    await url.save();
  }
}
