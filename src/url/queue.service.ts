import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Url } from './url.schema';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('url-analitycs') private readonly taskQueue: Queue,
  ) {}

  async addTask(url: Url) {
    await this.taskQueue.add('processTask', url);
  }
}
