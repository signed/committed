import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { TrpcContext } from './context'

const t = initTRPC.context<TrpcContext>().create()
const router = t.router
const publicProcedure = t.procedure

const ChangeTicketTestStatusSchema = z.object({ title: z.string() })

const ticketTest = router({
  setStatus: t.procedure.input(ChangeTicketTestStatusSchema).mutation(async ({ input }) => {
    //ctx.taskStorage.transitionTicketTest()
    return { title: input.title }
  }),
})

// root router to call
export const appRouter = router({
  // merge predefined routers
  ticketTest,
  // or individual procedures
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    const name = input ?? 'world'
    return `👋hello ${name}`
  }),
})

export type AppRouter = typeof appRouter
