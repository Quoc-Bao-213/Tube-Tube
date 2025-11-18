import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedures";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  comments: commentsRouter,
  search: searchRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  suggestions: suggestionsRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
  commentReactions: commentReactionsRouter,
});

export type AppRouter = typeof appRouter;
