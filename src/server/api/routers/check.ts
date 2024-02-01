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
        message: checks.message,
      }).from(checks).where(eq(checks.taskId, input.taskId));

      const dbRecord = check[0];
      let message: string | null = null;

      if (!dbRecord) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // const og = await ogs({ url: dbRecord.url });

      const data = await getTask(input.taskId);

      if (data.status === 'COMPLETED' && data.data && dbRecord.message === null) {
        const url = new URL(dbRecord.url);

        const completion = await ctx.openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: [
                `I have analyzed the website ${url.host} to determine the factuality of its content. The results of the analysis are as follows:`,
                'These are label classifications, which are based on the factuality of the content of the website.',
                `- High Factuality: ${Math.round(data.data.site.label0 * 100)}%`,
                `- Mixed Factuality: ${Math.round(data.data.site.label1 * 100)}%`,
                `- Low Factuality: ${Math.round(data.data.site.label2 * 100)}%`,
                '',
                'Based on these results, please provide a concise summary that explains the factuality level of the website, and providing insights into what these results imply about the content of the website.',
                'Do not hesitate to include your own opinion about the website.',
                'Please, keep it short and concise. Keep it around 360 characters.',
              ].join('\n')
            }
          ],
          model: 'gpt-3.5-turbo',
        });

        const text = completion.choices[0]?.message.content;

        if (text) {
          message = text;

          await ctx.db.update(checks).set({
            message: text,
          }).where(eq(checks.taskId, input.taskId));
        }
      }

      if (dbRecord.message) {
        message = dbRecord.message;
      }

      return {
        url: dbRecord.url,
        createdAt: dbRecord.createdAt,
        data,
        message,
        // og,
      };
    }),
});
