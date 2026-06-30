import { pgTable, serial, text, timestamp, integer, date, jsonb, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Guest"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  value: integer("value").notNull(), // 1-5 scale
  label: text("label").notNull(), // e.g. "calm", "anxious", "happy"
  note: text("note"),
  factors: jsonb("factors").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title"),
  content: text("content").notNull(),
  moodLabel: text("mood_label"),
  moodValue: integer("mood_value"),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  moodContext: text("mood_context"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const breathingSessions = pgTable("breathing_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  technique: text("technique").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  targetDays: integer("target_days").default(7),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").references(() => habits.id).notNull(),
  completedDate: date("completed_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // "weekly", "monthly", "milestone"
  title: text("title").notNull(),
  content: text("content").notNull(),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
