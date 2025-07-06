import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const phoneNumbers = pgTable('phone_numbers', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: text('number').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  phoneNumberId: uuid('phone_number_id')
    .notNull()
    .references(() => phoneNumbers.id),
  greetingUrl: text('greeting_url').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export type PhoneNumber = typeof phoneNumbers.$inferSelect;
export type NewPhoneNumber = typeof phoneNumbers.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
