import { initTRPC, TRPCError } from '@trpc/server'
import { EventEmitter } from 'events'
import { z } from 'zod'
import { TrpcContext } from './context'
import { idGenerator, inMemoryDatabase, Message } from './in-memory-database'

const t = initTRPC.context<TrpcContext>().create()
const router = t.router
const publicProcedure = t.procedure

const eventEmitter = new EventEmitter()

inMemoryDatabase.messages.push(createMessage('initial message'))

function createMessage(text: string): Message {
  const msg = {
    id: idGenerator.nextMessageId(),
    text,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  eventEmitter.emit('newMessage', msg)
  return msg
}

const postRouter = router({
  createPost: t.procedure.input(z.object({ title: z.string() })).mutation(({ input }) => {
    const post = {
      id: idGenerator.nextPostId(),
      ...input,
    }
    inMemoryDatabase.posts.push(post)
    return post
  }),
  listPosts: publicProcedure.query(() => inMemoryDatabase.posts),
})

const messageRouter = router({
  addMessage: publicProcedure.input(z.string()).mutation(({ input }) => {
    const msg = createMessage(input)
    inMemoryDatabase.messages.push(msg)

    return msg
  }),
  listMessages: publicProcedure.query(() => inMemoryDatabase.messages),
})

// root router to call
export const appRouter = router({
  // merge predefined routers
  post: postRouter,
  message: messageRouter,
  // or individual procedures
  hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
    return `👋hello ${input ?? ctx.user?.name ?? 'world'}`
  }),
  // or inline a router
  admin: router({
    secret: publicProcedure.query(({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      if (ctx.user?.name !== 'alex') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return {
        secret: 'sauce',
      }
    }),
  }),
})

export type AppRouter = typeof appRouter
