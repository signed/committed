import * as trpcExpress from '@trpc/server/dist/adapters/express'
import { inferAsyncReturnType } from '@trpc/server'
import { TaskStorage } from '../src/pages/index/TaskStorage'

type AdditionalContext = {
  taskStorage: TaskStorage
}

export const createContext = (additionalContext: AdditionalContext) => {
  return ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
    return {
      ...additionalContext,
      req,
      res,
    }
  }
}

export type TrpcContext = inferAsyncReturnType<ReturnType<typeof createContext>>
