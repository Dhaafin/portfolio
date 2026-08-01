import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  role: text('role'),
  year: text('year'),
  description: text('description'),
  details: text('details'),
  technologies: text('technologies', { mode: 'json' }),
  project_type: text('project_type'),
  demo_url: text('demo_url'),
  github_url: text('github_url'),
  image_url: text('image_url'),
  is_published: integer('is_published', { mode: 'boolean' }).default(false),
  is_featured: integer('is_featured', { mode: 'boolean' }).default(false),
  order: integer('order').default(0),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const experiences = sqliteTable('experiences', {
  id: text('id').primaryKey(),
  year: text('year'),
  era: text('era'),
  company: text('company').notNull(),
  role: text('role').notNull(),
  period: text('period'),
  points: text('points', { mode: 'json' }),
  color: text('color'),
  order: integer('order').default(0),
  skills: text('skills', { mode: 'json' }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const certifications = sqliteTable('certifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  issuer_short: text('issuer_short'),
  issue_date: text('issue_date'),
  color: text('color').default('#60A5FA'),
  skills: text('skills', { mode: 'json' }),
  credential_url: text('credential_url'),
  order: integer('order').default(0),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const visits = sqliteTable('visits', {
  id: text('id').primaryKey(),
  session_id: text('session_id'),
  path: text('path').notNull(),
  referrer: text('referrer'),
  user_agent: text('user_agent'),
  country: text('country'),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category'),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const otps = sqliteTable('otps', {
  email: text('email').primaryKey(),
  code: text('code').notNull(),
  expires_at: integer('expires_at').notNull()
});

export const chatLogs = sqliteTable('chat_logs', {
  id: text('id').primaryKey(),
  ip: text('ip').notNull(),
  email: text('email'),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const chatUsers = sqliteTable('chat_users', {
  email: text('email').primaryKey(),
  verified_at: text('verified_at').default(sql`(CURRENT_TIMESTAMP)`),
  query_count: integer('query_count').default(0),
  last_active: text('last_active').default(sql`(CURRENT_TIMESTAMP)`),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});
