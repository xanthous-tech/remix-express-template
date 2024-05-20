import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';

import { emailQueue } from './email';

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ctrls');

createBullBoard({
  serverAdapter,
  queues: [new BullMQAdapter(emailQueue)],
});
