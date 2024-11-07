import * as trpcExpress from '@trpc/server/dist/adapters/express'
import { inferAsyncReturnType } from '@trpc/server'
import { TaskStorage } from '../src/pages/index/TaskStorage'

type AdditionalContext = {
  taskStorage: TaskStorage
}

export const createContext = (additionalContext: AdditionalContext) => {
  return ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
    const getUser = () => {
      if (req.headers.authorization !== 'secret') {
        return null
      }
      return {
        name: 'alex',
      }
    }

    return {
      ...additionalContext,
      req,
      res,
      user: getUser(),
    }
  }
}

export type TrpcContext = inferAsyncReturnType<ReturnType<typeof createContext>>
