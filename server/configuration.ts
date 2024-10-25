import { absolutePathFor } from './path'

import { Treeish } from '../src/core/project'

export type GitRepositoryConfiguration = {
  baseDirectory: string
  from: Treeish
  to: Treeish
}

export type Configuration = {
  repository: GitRepositoryConfiguration
  ticketing: TicketingConfiguration
}

export type TicketingConfiguration = {
  project: string
  url: string
}

export const loadConfigurationFrom = (env: NodeJS.ProcessEnv): Configuration | 'failed' => {
  const baseDirectory = absolutePathFor(env['BASE_DIRECTORY'] ?? process.cwd())
  const from = env['FROM']
  const to = env['TO']
  const project = env['PROJECT']
  const url = env['TICKET_URL']

  if (from === undefined || to === undefined || project === undefined || url === undefined) {
    return 'failed'
  }

  return {
    repository: {
      baseDirectory,
      from,
      to,
    },
    ticketing: {
      project,
      url,
    },
  }
}
