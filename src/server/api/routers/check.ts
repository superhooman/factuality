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

const topicSchema = z.object({
    general: z.string(),
    economic: z.string(),
    education: z.string(),
    environmental: z.string(),
});

type Topics = z.infer<typeof topicSchema>;

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
        topics: checks.topics,
      }).from(checks).where(eq(checks.taskId, input.taskId));

      const dbRecord = check[0];
      let topics: Topics | null = null;

      if (!dbRecord) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // const og = await ogs({ url: dbRecord.url });

      const data = await getTask(input.taskId);

      if (data.status === 'COMPLETED' && data.data && dbRecord.topics === null) {
        const url = new URL(dbRecord.url);

        const completion = await ctx.openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: [
                'General Philosophy',
                'Left: Collectivism: Community over the individual. Equality, environmental protection, expanded educational opportunities, social safety nets for those who need them. ',
                'Right: Individualism: Individual over the community. Limited Government with Individual freedom and personal property rights. Competition. ',
                '',
                'Economic Policy',
                'Left: Income equality; higher tax rates on the wealthy; government spending on social programs and infrastructure; stronger regulations on business. Minimum wages and some redistribution of wealth.',
                'Right: Lower taxes; less regulation on businesses; reduced government spending.  The government should tax less and spend less. Charity over social safety nets. Wages should be set by the free market.',
                '',
                'Education Policy',
                'Left: Favor expanded free, public education. Reduced cost or free college.',
                'Right: Supports homeschooling and private schools. Generally not opposed to public education, but critical of what is taught.',
                '',
                'Environmental Policy',
                'Left: Regulations to protect the environment. Climate change is human-influenced and immediate action is needed to slow it.',
                'Right: Considers the economic impact of environmental regulation. Believe the free market will find its own solution to environmental problems, including climate change. Some deny climate change is human-influenced.',
                '',
                `Given that, what is the stance of ${url.hostname} on these topics?`,
                '',
                'Give only json output, for example:',
                '```json',
                '{',
                '    "general": "...",',
                '    "economic": "...",',
                '    "education": "...",',
                '    "environmental": "..."',
                '}',
                '```'
              ].join('\n')
            }
          ],
          model: 'gpt-3.5-turbo',
        });

        const text = completion.choices[0]?.message.content;

        if (text) {
            const parsed = topicSchema.safeParse(JSON.parse(text));

            if (parsed.success) {
                topics = parsed.data;

                await ctx.db.update(checks).set({ topics }).where(eq(checks.taskId, input.taskId));
            }
        }
      }

      if (dbRecord.topics) {
        topics = dbRecord.topics as Topics;
      }

      return {
        url: dbRecord.url,
        createdAt: dbRecord.createdAt,
        data,
        topics,
        // message,
        // og,
      };
    }),
});
