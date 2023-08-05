import * as trpcExpress from '@trpc/server/dist/adapters/express'
import { inferAsyncReturnType } from '@trpc/server'

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const getUser = () => {
    if (req.headers.authorization !== 'secret') {
      return null
    }
    return {
      name: 'alex',
    }
  }

  return {
    req,
    res,
    user: getUser(),
  }
}
export type TrpcContext = inferAsyncReturnType<typeof createContext>
