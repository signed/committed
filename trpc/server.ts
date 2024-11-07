import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { TrpcContext } from './context'
import { idGenerator, inMemoryDatabase, Message } from './in-memory-database'

const t = initTRPC.context<TrpcContext>().create()
const router = t.router
const publicProcedure = t.procedure

inMemoryDatabase.messages.push(createMessage('initial message'))

function createMessage(text: string): Message {
  return {
    id: idGenerator.nextMessageId(),
    text,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

const CreatePostSchema = z.object({ title: z.string() })

function createPostFrom(title: string) {
  const post = {
    id: idGenerator.nextPostId(),
    title,
  }
  inMemoryDatabase.posts.push(post)
  return post
}

const postRouter = router({
  createPost: t.procedure.input(CreatePostSchema).mutation(({ input }) => {
    return createPostFrom(input.title)
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
