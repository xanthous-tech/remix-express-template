import { Job, Worker } from 'bullmq';
import { z } from 'zod';

import { EMAIL, emailJobDataSchema } from '@/types/jobs/email';
import { defaultWorkerOptions } from '@/lib/bullmq';
import { logger as parentLogger } from '@/utils/logger';

const logger = parentLogger.child({ worker: EMAIL });
logger.trace(`register worker for queue ${EMAIL}`);

async function emailWorkerProcess(
  job: Job<z.infer<typeof emailJobDataSchema>>,
) {
  const input = emailJobDataSchema.parse(job.data);
  return input;
}

const emailWorker = new Worker(EMAIL, emailWorkerProcess, {
  ...defaultWorkerOptions,
  concurrency: 1,
});

export default emailWorker;
