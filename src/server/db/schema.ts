import { relations } from "drizzle-orm";
import {
  bigserial,
  index,
  primaryKey,
  text,
  integer,
  timestamp,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const checks = pgTable(
  "check",
  {
    id: bigserial("id", { mode: 'number' }).primaryKey(),
    taskId: varchar("taskId", { length: 512 }).notNull(),
    url: varchar("url", { length: 512 }).notNull(),
    createdById: varchar("createdById", { length: 512 }).notNull(),
    message: text("message"),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    urlIndex: index("url_idx").on(example.url),
  })
);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: timestamp("emailVerified", { mode: "date" }),
 image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);
