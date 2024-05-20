import { TRPCError, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

interface Meta {
  authRequired: boolean;
}

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  user: res.locals.user,
  session: res.locals.session,
}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC.context<Context>().meta<Meta>().create();

export const authedProcedure = t.procedure.use(async (opts) => {
  const { meta, next, ctx } = opts;
  // only check authorization if enabled
  if (meta?.authRequired && !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});

export const appRouter = t.router({
  getUser: authedProcedure
    .meta({ authRequired: false })
    .input(z.string())
    .query((opts) => {
      opts.input; // string
      return { id: opts.input, name: 'Bilbo' };
    }),
  createUser: authedProcedure
    .meta({ authRequired: true })
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
