import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, text, timestamp, integer, } from 'drizzle-orm/pg-core';
import { unique } from 'drizzle-orm/pg-core';

export const users = pgTable('User', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  avatar: varchar('avatar', { length: 255 }),
  cover: varchar('cover', { length: 255 }),
  f_name: varchar('f_name', { length: 255 }),
  l_name: varchar('l_name', { length: 255 }),
  description: text('description'),
  city: varchar('city', { length: 255 }),
  school: varchar('school', { length: 255 }),
  work: varchar('work', { length: 255 }),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow()
});

export const posts = pgTable('Post', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  img: varchar('img', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull().$onUpdate(() => new Date()),
  userId: varchar('userId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull()
});

export const comments = pgTable('Comment', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull().$onUpdate(() => new Date()),
  userId: varchar('userId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  postId: integer('postId').references(() => posts.id, { onDelete: 'cascade' }).notNull()
});

export const likes = pgTable('Like', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  userId: varchar('userId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  postId: integer('postId').references(() => posts.id, { onDelete: 'cascade' }),
  commentId: integer('commentId').references(() => comments.id, { onDelete: 'cascade' })
});

export const followers = pgTable('Follower', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow(),
  followerId: varchar('followerId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  followingId: varchar('followingId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' })
});

export const followRequests = pgTable('FollowRequest', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  senderId: varchar('senderId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recieverId: varchar('recieverId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull()
}, (table) => ({
  unq:unique().on(table.senderId, table.recieverId)
}));

export const blocks = pgTable('Block', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  blockerId: varchar('blockerId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  blockedId: varchar('blockedId', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  unq:unique().on(table.blockerId, table.blockedId)
}));

export const stories = pgTable('Story', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').defaultNow(),
  expiresAt: timestamp('expiresAt'),
  userId: varchar('userId', { length: 255 }).unique().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  img: varchar('img', { length: 255 })
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes)
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id]
  }),
  comments: many(comments),
  likes: many(likes)
}));

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  likes: many(likes)
}));

export const likeRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id]
  }),
  comment: one(comments, {
    fields: [likes.commentId],
    references: [comments.id]
  })
}));

export const followRequestsRelations = relations(followRequests, ({ one }) => ({
  sender: one(users, {
    fields: [followRequests.senderId],
    references: [users.id]
  })
}));