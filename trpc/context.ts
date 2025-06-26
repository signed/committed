import * as trpcExpress from '@trpc/server/adapters/express'
import { TaskStorage } from '../src/core/TaskStorage'

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

export type TrpcContext = Awaited<ReturnType<typeof createContext>>
