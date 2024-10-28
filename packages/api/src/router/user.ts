import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({ where: { clerkId: ctx.auth.userId } });
  }),
});
