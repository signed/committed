import { absolutePathFor } from './path'

import { Treeish } from '../src/core/project'
import { Tester } from '../src/core/ReleaseTasks'

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
  testers: Tester[]
}

export type Configuration = {
  repository: GitRepositoryConfiguration
  ticketing: TicketingConfiguration
  release: ReleaseConfiguration
}

function parseReleaseTaskNames(releaseTasksString: string) {
  return releaseTasksString.split('|') as ReleaseTaskName[]
}

function parseTesters(testersString: string): Tester[] {
  return testersString
    .split('|')
    .map((s) => s.trim())
    .map((full) => {
      const parts = full.split(' ')
      const first = parts[0] ?? full
      const last = parts[1] ?? ''
      return {
        full,
        first,
        last,
      }
    })
}

export const loadConfigurationFrom = (env: NodeJS.ProcessEnv): Configuration | 'failed' => {
  const baseDirectory = absolutePathFor(env['BASE_DIRECTORY'] ?? process.cwd())
  const from = env['FROM']
  const to = env['TO']
  const project = env['PROJECT']
  const url = env['TICKET_URL']
  const releaseTasksString = env['RELEASE_TASKS']
  const testersString = env['TESTERS']

  if (
    from === undefined ||
    to === undefined ||
    project === undefined ||
    url === undefined ||
    releaseTasksString === undefined ||
    testersString === undefined
  ) {
    return 'failed'
  }

  const releaseTasks = parseReleaseTaskNames(releaseTasksString)
  const testers = parseTesters(testersString)

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
      testers,
    },
  }
}
