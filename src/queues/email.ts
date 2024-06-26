import { Queue, QueueEvents } from 'bullmq';
import { z } from 'zod';

import { EMAIL, emailJobDataSchema } from '@/types/jobs/email';
import { defaultQueueEventsOptions, defaultQueueOptions } from '@/lib/bullmq';
import { logger as parentLogger } from '@/utils/logger';

const logger = parentLogger.child({ queue: EMAIL });
logger.trace(`register queue ${EMAIL}`);

export const emailQueue = new Queue<z.infer<typeof emailJobDataSchema>>(
  EMAIL,
  defaultQueueOptions,
);

const emailQueueEvents = new QueueEvents(EMAIL, defaultQueueEventsOptions);

emailQueue.on('error', (err) => {
  logger.error(err);
  // Sentry.captureException(err);
});

emailQueueEvents.on('error', (err) => {
  logger.error(err);
  // Sentry.captureException(err);
});

export async function email(payload: z.infer<typeof emailJobDataSchema>) {
  const job = await emailQueue.add(payload.eventId, payload, {
    jobId: payload.eventId,
  });

  return job.waitUntilFinished(emailQueueEvents);
}
