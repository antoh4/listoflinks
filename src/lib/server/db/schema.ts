import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema'; // Import the user table

export const task = sqliteTable('task', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const list = sqliteTable('list', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const link = sqliteTable('link', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text('url').notNull(),
    title: text('title').notNull(),
    year: integer('year'),
    listId: text('list_id').notNull().references(() => list.id, { onDelete: 'cascade' }),
});

export const listRelations = relations(list, ({ one, many }) => ({
    user: one(user, {
        fields: [list.userId],
        references: [user.id],
    }),
    links: many(link),
}));

export const linkRelations = relations(link, ({ one }) => ({
    list: one(list, {
        fields: [link.listId],
        references: [list.id],
    }),
}));

// Add userRelations to schema.ts to define the relationship with lists
export const userRelations = relations(user, ({ many }) => ({
    lists: many(list),
}));

export *  from './auth.schema';