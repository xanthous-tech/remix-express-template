import { type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Cookie } from 'oslo/cookie';
import type { User, Session } from 'lucia';

import { auth, getSessionCookieFromSession } from '@/lib/auth';

export interface ValidateSessionPayload {
  session: Session | null;
  user: User | null;
  sessionCookie: Cookie | null;
}

export async function validateSession({
  request,
}: LoaderFunctionArgs): Promise<ValidateSessionPayload> {
  const { pathname } = new URL(request.url);

  const cookieHeader = request.headers.get('cookie') || '';
  const sessionId = auth.readSessionCookie(cookieHeader);

  if (!sessionId) {
    throw redirect(`/signin?callbackUrl=${pathname}`);
  }

  const { session, user } = await auth.validateSession(sessionId);
  const sessionCookie = getSessionCookieFromSession(session);

  return {
    session,
    user,
    sessionCookie,
  };
}

export async function signout({ request }: LoaderFunctionArgs): Promise<void> {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionId = auth.readSessionCookie(cookieHeader);

  if (sessionId) {
    await auth.invalidateSession(sessionId);
  }
}
