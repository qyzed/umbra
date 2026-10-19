import {
  pgTable,
  serial,
  bigint,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ————— UMBRA · схема данных мини-приложения —————
// Зеркалит модель бота: ID отправителя хранится технически
// (для банов) и никогда не отдаётся клиенту целиком.

export const umbraUsers = pgTable("umbra_users", {
  tgId: bigint("tg_id", { mode: "number" }).primaryKey(),
  username: text("username"),
  fullName: text("full_name"),
  notifications: boolean("notifications").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const umbraMessages = pgTable(
  "umbra_messages",
  {
    id: serial("id").primaryKey(),
    senderTgId: bigint("sender_tg_id", { mode: "number" }).notNull(),
    recipientTgId: bigint("recipient_tg_id", { mode: "number" }).notNull(),
    kind: text("kind").notNull().default("text"), // text | photo | video | sticker
    body: text("body"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("idx_umbra_messages_recipient").on(t.recipientTgId, t.id)],
);

export const umbraBans = pgTable("umbra_bans", {
  id: serial("id").primaryKey(),
  ownerId: bigint("owner_id", { mode: "number" }).notNull(),
  blockedId: bigint("blocked_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UmbraMessage = typeof umbraMessages.$inferSelect;
