import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input; // string
    return { id: opts.input, name: 'Bilbo' };
  }),
  createUser: t.procedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation(async (opts) => {
      console.log(opts);
      // // use your ORM of choice
      // return await UserModel.create({
      //   data: opts.input,
      // });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const trpc = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});
