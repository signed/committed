// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import { renderPage, createDevMiddleware } from 'vike/server'
import { root } from './root.js'
import { loadConfigurationFrom } from './configuration'
import * as fs from 'node:fs'
import { deriveProjectFrom } from './path'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from '../trpc/server'
import { createContext } from '../trpc/context'
import { InMemoryTaskStorage } from './InMemoryTaskStorage'
import { TaskStorage } from '../src/core/TaskStorage'

const isProduction = process.env['NODE_ENV'] === 'production'
const taskStorage: TaskStorage = new InMemoryTaskStorage()
const configuration = loadConfigurationFrom(process.env)
if (configuration === 'failed') {
  console.error('missing configuration')
  process.exit(1)
}
const baseDirectory = configuration.repository.baseDirectory
const stat = fs.lstatSync(baseDirectory)
if (!stat.isDirectory()) {
  console.error(`${baseDirectory} is not a directory`)
  process.exit(1)
}

const project = deriveProjectFrom(baseDirectory)

startServer().catch((e) => console.log(e))

async function startServer() {
  const app = express()

  app.use(compression())

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContext({ taskStorage }),
    }),
  )

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  // vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('/{*splat}', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      project,
      configuration,
      taskStorage,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    }
    const { body, statusCode, headers, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode)
    // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
    res.send(body)
  })

  const port = process.env['PORT'] || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
