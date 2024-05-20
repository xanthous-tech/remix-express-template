import 'dotenv/config';
import { ServerBuild, installGlobals } from '@remix-run/node';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import compression from 'compression';

import { IS_PROD } from './config/server';
import { trpc } from './trpc';
import { serverAdapter } from './queues';
import { httpLogger, logger as parentLogger } from './utils/logger';
import { authRouter } from './middlewares/auth';
import './workers/register';

installGlobals();
const logger = parentLogger.child({ component: 'main' });

const viteDevServer = IS_PROD
  ? undefined
  : await import('vite').then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          'virtual:remix/server-build',
        ) as Promise<ServerBuild>
    : await import('../build/server/index.js'),
});

const app = express();

app.use(compression());
if (IS_PROD) {
  app.use(httpLogger);
}

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }));

// handle trpc requests
app.use('/api/trpc', trpc);

// handle server-side auth redirects
app.use('/api/auth', authRouter);

// handle bull-board requests
app.use('/ctrls', serverAdapter.getRouter());

// handle SSR requests
app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  logger.info(`Express server listening at http://localhost:${port}`),
);
