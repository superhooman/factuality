import {
  createTRPCRouter,
  protectedProcedure,
} from "@src/server/api/trpc";
import { createTask, getTask } from "@src/server/backend";
import { checks } from "@src/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

// import ogs from 'open-graph-scraper';

export const checkRouter = createTRPCRouter({
  get: protectedProcedure
    .query(async ({ ctx }) => {
      const items = await ctx.db.select({
        id: checks.id,
        url: checks.url,
        taskId: checks.taskId,
        createdAt: checks.createdAt,
      }).from(checks).where(eq(checks.createdById, ctx.session.user.id)).orderBy(desc(checks.createdAt)).limit(9);

      return items;
    }),
  create: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    ).mutation(async ({ ctx, input }) => {
      const task = await createTask(input.url);

      await ctx.db.insert(checks).values({
        taskId: task.task_id,
        url: input.url,
        createdById: ctx.session.user.id,
      });

      return task.task_id;
    }),
  result: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const check = await ctx.db.select({
        url: checks.url,
        createdAt: checks.createdAt,
      }).from(checks).where(eq(checks.taskId, input.taskId));

      if (!check[0]) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // const og = await ogs({ url: check[0].url });

      const data = await getTask(input.taskId);

      return {
        url: check[0].url,
        createdAt: check[0].createdAt,
        data,
        // og,
      };
    }),
});
