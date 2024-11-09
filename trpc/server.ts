import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { TrpcContext } from './context'
import { NoTicketIdentifier, TicketIdentifier } from '../src/core/ExtractReferencedTicketUrls'
import { StatusValues } from '../src/core/ReleaseTasks'

const t = initTRPC.context<TrpcContext>().create()
const router = t.router
const publicProcedure = t.procedure

const TicketIdentifierSchema = z.custom<TicketIdentifier | NoTicketIdentifier>((val) => {
  const isString = typeof val === 'string'
  if (!isString) {
    return false
  }
  return val !== ''
})

const StatusSchema = z.enum(StatusValues)

const ChangeTicketTestStatusSchema = z.object({ identifier: TicketIdentifierSchema, status: StatusSchema })

const ticketTest = router({
  setStatus: t.procedure.input(ChangeTicketTestStatusSchema).mutation(async ({ input, ctx }) => {
    await ctx.taskStorage.transitionTicketTest(input.identifier, input.status)
    return 'success'
  }),
})

const ChangeTaskTestStatusSchema = z.object({ name: z.string(), status: StatusSchema })
const task = router({
  setStatus: t.procedure.input(ChangeTaskTestStatusSchema).mutation(async ({ input, ctx }) => {
    await ctx.taskStorage.transitionTaskStatus(input.name, input.status)
    return 'success'
  }),
})

// root router to call
export const appRouter = router({
  task,
  ticketTest,
  // or individual procedures
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    const name = input ?? 'world'
    return `👋hello ${name}`
  }),
})

export type AppRouter = typeof appRouter
