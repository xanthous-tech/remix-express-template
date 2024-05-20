import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { db } from '@/db/drizzle';
import { sessionTable, userTable } from '@/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const auth = new Lucia(adapter);

interface DatabaseUserAttributes {
  username: string;
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
