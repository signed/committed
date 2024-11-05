import { CommitsContainer, NoTicket, type Ticket, TicketIdentifier } from './ExtractReferencedTicketUrls'
import { ReleaseConfiguration, ReleaseTaskName } from '../../server/configuration'

export type Status = 'todo' | 'in progress' | 'done'

export type GenericTask = {
  type: 'generic'
  status: Status
  name: string
}

export type TicketTest = {
  required: boolean
  status: Status
  ticket: Ticket | NoTicket
  tester: string[]
}

export type TestTask = {
  type: 'test'
  ticketTests: TicketTest[]
}

export type Task = GenericTask | TestTask

const deriveTicketTestFor = (container: CommitsContainer): TicketTest => {
  const authors = container.commits.map((commit) => commit.author)
  const tester = [...new Set(authors)]
  return {
    required: true,
    status: 'todo',
    ticket: container.ticket,
    tester,
  }
}

const testTasksFrom = (ticketIdentifierToDetails: Map<TicketIdentifier, CommitsContainer>): TestTask => {
  const ticketTests = Array.from(ticketIdentifierToDetails.values()).map(deriveTicketTestFor)
  return {
    type: 'test',
    ticketTests,
  }
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

export const overallTestStatus = (testTask: TestTask): Status => {
  const ticketTests = testTask.ticketTests
  const atLeastOneInProgress = ticketTests.some((test) => test.status === 'in progress')
  if (atLeastOneInProgress) {
    return 'in progress'
  }
  const allTodo = ticketTests.every((test) => test.status === 'todo')
  if (allTodo) {
    return 'todo'
  }
  return 'done'
}
