import { absolutePathFor } from './path'

import { Treeish } from '../src/core/project'

export type GitRepositoryConfiguration = {
  baseDirectory: string
  from: Treeish
  to: Treeish
}

export type TicketingConfiguration = {
  project: string
  url: string
}

export type ReleaseTaskName = string & { __brand: 'ReleaseTaskName' }

export type ReleaseConfiguration = {
  tasks: ReleaseTaskName[]
}

export type Configuration = {
  repository: GitRepositoryConfiguration
  ticketing: TicketingConfiguration
  release: ReleaseConfiguration
}

export const loadConfigurationFrom = (env: NodeJS.ProcessEnv): Configuration | 'failed' => {
  const baseDirectory = absolutePathFor(env['BASE_DIRECTORY'] ?? process.cwd())
  const from = env['FROM']
  const to = env['TO']
  const project = env['PROJECT']
  const url = env['TICKET_URL']
  const releaseTasksString = env['RELEASE_TASKS']

  if (
    from === undefined ||
    to === undefined ||
    project === undefined ||
    url === undefined ||
    releaseTasksString === undefined
  ) {
    return 'failed'
  }

  function parseReleaseTaskNames(releaseTasksString: string) {
    return releaseTasksString.split('|') as ReleaseTaskName[]
  }

  const releaseTasks = parseReleaseTaskNames(releaseTasksString)

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
    release: {
      tasks: releaseTasks,
    },
  }
}
