import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Url } from './url.schema';
import { UrlService } from './url.service';

@Processor('url-analitycs')
export class QueueProcessor extends WorkerHost {
  constructor(private readonly urlService: UrlService) {
    super();
  }
  async process(job: Job<Url>) {
    await this.urlService.updateAnalytics(job.data);
    return `Processed: ${JSON.stringify(job.data)}`;
  }
}
