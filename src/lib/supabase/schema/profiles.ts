import { users } from '@/lib/supabase/references/auth.user';
import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const profiles = pgTable(
  'profiles',
  {
    id: uuid().primaryKey().defaultRandom(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    default_destination: text(),
    default_remarks: text(),
    signature: text(),
    signatories: jsonb().$type<
      {
        id: number;
        name: string;
        title: string;
        includeSignature: boolean;
      }[]
    >(),
    user_id: uuid()
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull()
      .unique(),
  },
  () => [
    pgPolicy('Profiles RLS for ALL', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      withCheck: sql`(( SELECT auth.uid() AS uid) = user_id)`,
      using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
    }),
  ],
);

export type Profiles = typeof profiles.$inferSelect;
export type NewProfiles = typeof profiles.$inferInsert;

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.user_id],
    references: [users.id],
  }),
}));

export const usersProfilesRelations = relations(users, ({ one }) => ({
  profile: one(profiles),
}));
