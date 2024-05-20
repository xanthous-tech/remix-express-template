import { pgTable, timestamp, text, unique } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name'),
  image: text('image'),
  customerId: text('customer_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});

export const accountTable = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    idToken: text('id_token'),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
  },
  (t) => ({
    uniqueOnProvider: unique().on(t.provider, t.providerAccountId),
  }),
);

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
