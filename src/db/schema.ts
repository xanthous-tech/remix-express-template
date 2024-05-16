import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  githubId: text('github_id'),
  githubUsername: text('github_username'),
  appleId: text('apple_id'),
  appleName: text('apple_name'),
  appleEmail: text('apple_email'),
});

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
