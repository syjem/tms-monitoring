import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './auth';

export const workLogs = pgTable('work_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  created_at: timestamp('created_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
  period: text('period').notNull(),
  logs: jsonb('logs').notNull(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  user: one(users, {
    fields: [workLogs.user_id],
    references: [users.id],
  }),
}));

export const usersWorklogRelations = relations(users, ({ many }) => ({
  workLogs: many(workLogs),
}));

export type WorkLog = InferSelectModel<typeof workLogs>;
export type NewWorkLog = InferInsertModel<typeof workLogs>;
