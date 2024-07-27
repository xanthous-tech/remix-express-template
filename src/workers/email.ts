import { Job, Worker } from 'bullmq';

import { EMAIL, EmailJobData, emailJobDataSchema } from '@/types/jobs/email';
import { defaultWorkerOptions } from '@/lib/bullmq';
import { logger as parentLogger } from '@/utils/logger';

const logger = parentLogger.child({ worker: EMAIL });
logger.trace(`register worker for queue ${EMAIL}`);

async function emailWorkerProcess(job: Job<EmailJobData>) {
  const input: EmailJobData = emailJobDataSchema.parse(job.data);
  return input;
}

const emailWorker = new Worker(EMAIL, emailWorkerProcess, {
  ...defaultWorkerOptions,
  concurrency: 1,
});

export default emailWorker;
