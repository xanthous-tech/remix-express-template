import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';

import { emailQueue } from './email';

export const bullboardServerAdapter = new ExpressAdapter();
bullboardServerAdapter.setBasePath('/ctrls');

createBullBoard({
  serverAdapter: bullboardServerAdapter,
  queues: [new BullMQAdapter(emailQueue)],
});
