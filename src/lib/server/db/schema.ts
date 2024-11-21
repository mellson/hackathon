import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const subjectsTable = pgTable('subject', {
	id: serial('id').primaryKey(),
	emoji: text('emoji').notNull(),
	name: text('name').notNull(),
	description: text('description').notNull()
});

export const subjectLikesTable = pgTable('subject_likes', {
	subjectId: integer('subject_id').references(() => subjectsTable.id),
	deviceId: text('device_id').notNull()
});

export type SelectSubject = typeof subjectsTable.$inferSelect;
export type InsertSubject = typeof subjectsTable.$inferInsert;
