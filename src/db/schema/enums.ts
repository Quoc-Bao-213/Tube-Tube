import { pgEnum } from "drizzle-orm/pg-core";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);
export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);
