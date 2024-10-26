import { CommitsContainer, NoTicket, type Ticket, TicketIdentifier } from './ExtractReferencedTicketUrls'
import { ReleaseConfiguration, ReleaseTaskName } from '../../server/configuration'

export type TaskStatus = 'todo' | 'in progress' | 'done'

export type GenericTask = {
  type: 'generic'
  status: TaskStatus
  name: string
}

export type TestTask = {
  type: 'test'
  required: boolean
  status: TaskStatus
  ticket: Ticket | NoTicket
  tester: string[]
}

export type Task = GenericTask | TestTask

const testTasksFrom = (ticketIdentifierToDetails: Map<TicketIdentifier, CommitsContainer>): TestTask[] => {
  return Array.from(ticketIdentifierToDetails.entries()).map(([_, v]) => {
    const authors = v.commits.map((commit) => commit.author)
    const tester = [...new Set(authors)]
    return {
      type: 'test',
      required: true,
      status: 'todo',
      ticket: v.ticket,
      tester,
    } satisfies TestTask
  })
}

const getGenericTasks = (taskName: ReleaseTaskName): Task[] => [
  {
    type: 'generic',
    status: 'todo',
    name: taskName,
  },
]

export const deriveReleaseTasks = (
  ticketIdentifierToDetails: Map<TicketIdentifier, CommitsContainer>,
  releaseConfiguration: ReleaseConfiguration,
): Task[] => {
  return releaseConfiguration.tasks.flatMap((taskName) => {
    if (taskName === 'test') {
      return testTasksFrom(ticketIdentifierToDetails)
    }
    return getGenericTasks(taskName)
  })
}
