import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { videos } from "./videos";
import { reactionType } from "./enums";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: "video_reactions_pk", columns: [t.userId, t.videoId] }),
  ]
);

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
  user: one(users, { fields: [videoReactions.userId], references: [users.id] }),
  video: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));

export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
