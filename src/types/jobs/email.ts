import { z } from 'zod';

export const EMAIL = 'email';

export const emailJobDataSchema = z.object({
  eventId: z.string(),
  text: z.string(),
});
