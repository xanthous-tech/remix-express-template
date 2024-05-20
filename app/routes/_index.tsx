import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';

import { Button } from '~/components/ui/button';

import { trpc } from '~/trpc';
import { validateSession } from '~/lib/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Smart Bookmarks' },
    { name: 'description', content: 'AI-managed bookmarks' },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const payload = await validateSession(args);
  const headers: HeadersInit = {};
  if (payload.sessionCookie) {
    headers['Set-Cookie'] = payload.sessionCookie.serialize();
  }

  return json(
    {
      user: payload.user,
    },
    {
      headers,
    },
  );
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const userQuery = trpc.getUser.useQuery('1');

  useEffect(() => {
    if (!data.user) {
      navigate(`/signin?callbackUrl=${location.pathname}`);
    }
  }, [data, navigate, location.pathname]);

  return (
    <div className='m-4'>
      <h2 className='text-xl font-bold my-2'>Remix Express Template</h2>
      <p>{data.message}</p>
      <p>
        You are logged in as {data.user?.name}. {userQuery?.data?.name}
      </p>
      <p>
        <a href='/signout' className='underline'>
          Sign out here
        </a>
      </p>
    </div>
  );
}
