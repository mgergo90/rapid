import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { Url, UrlSchema } from './url.schema';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processer';
import { BullModule } from '@nestjs/bullmq';

console.log('Redis URL:', process.env.REDIS_URI);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    BullModule.registerQueue({
      name: 'url-analitycs',
      connection: {
        url: process.env.REDIS_URI,
      },
    }),
  ],
  controllers: [UrlController],
  providers: [UrlService, QueueService, QueueProcessor],
})
export class UrlModule {}
