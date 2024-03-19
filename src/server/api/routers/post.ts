import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { sorry } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  addSorry: protectedProcedure.mutation(async ({ ctx }) => {
    const val = await db
      .insert(sorry)
      .values({
        createdById: ctx.session.user?.name ?? "unknown",
      })
      .execute();
    return z.number().parse(Number(val.insertId));
  }),
  removeSorry: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(sorry).where(eq(sorry.id, input.id)).execute();
    }),
});
