import { Router } from 'express';

import { githubAuthRouter } from './github';

export const authRouter = Router();

authRouter.use('/github', githubAuthRouter);
