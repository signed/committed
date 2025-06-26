import { Author, CommitsContainer, NoTicket, type Ticket, TicketIdentifier } from './ExtractReferencedTicketUrls'
import { ReleaseConfiguration, ReleaseTaskName } from '../../server/configuration'

export const StatusValues = ['todo', 'in progress', 'done'] as const

export type Status = (typeof StatusValues)[number]

export type GenericTask = {
  type: 'generic'
  status: Status
  name: string
}

export type TicketTest = {
  required: boolean
  status: Status
  ticket: Ticket | NoTicket
  testers: Tester[]
}

export type TestTask = {
  type: 'test'
  name: 'Test'
  ticketTests: TicketTest[]
}

export type Tester = {
  full: string
  first: string
  last: string
}

const authorToTester = (author: Author): Tester => {
  const strings = author.split(' ')
  const first = strings[0] ?? author
  const last = strings[1] ?? ''
  return {
    full: author,
    first,
    last,
  }
}

export type Task = GenericTask | TestTask

const deriveTicketTestFor = (container: CommitsContainer): TicketTest => {
  const authors = container.commits.map((commit) => commit.author)
  const testers = [...new Set(authors)].map(authorToTester)
  return {
    required: true,
    status: 'todo',
    ticket: container.ticket,
    testers,
  }
}

const testTasksFrom = (ticketIdentifierToDetails: Map<TicketIdentifier, CommitsContainer>): TestTask => {
  const ticketTests = Array.from(ticketIdentifierToDetails.values()).map(deriveTicketTestFor)
  return {
    type: 'test',
    name: 'Test',
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
  const allDone = ticketTests.every((test) => test.status === 'done')
  if (allDone) {
    return 'done'
  }
  return 'todo'
}

export const statusToEmote = (status: Status) => {
  switch (status) {
    case 'todo':
      return '⏳'
    case 'in progress':
      return '▶️'
    case 'done':
      return '✅'
  }
}

export const ticketToShortString = (ticket: Ticket | NoTicket) => {
  if (ticket.kind === 'no-ticket') {
    return '[no ticket]'
  }
  return ticket.identifier
}

export const ticketToString = (ticket: Ticket | NoTicket) => {
  if (ticket.kind === 'no-ticket') {
    return '[no ticket]'
  }
  return ticket.url
}

export function testersToString(testers: Tester[]) {
  return testers.map((tester) => tester.full).join(', ')
}

export function testTaskSummary(testTask: TestTask) {
  const status = overallTestStatus(testTask)
  return `${statusToEmote(status)} Test`
}

export function ticketTestSummary(ticketTest: TicketTest) {
  return `${statusToEmote(ticketTest.status)} ${ticketToString(ticketTest.ticket)} ${testersToString(ticketTest.testers)}`
}

export function genericTaskSummary(task: GenericTask) {
  return `${statusToEmote(task.status)} ${task.name}`
}

export const produceMessage = (releaseTasks: Task[]) => {
  const lines = releaseTasks.flatMap((task) => {
    const type = task.type
    switch (type) {
      case 'generic':
        return genericTaskSummary(task)
      case 'test':
        return deriveTestLinesFrom(task)
    }
  })
  const message = lines.join('\n')
  return { message, lineCount: lines.length }
}

function deriveTestLinesFrom(testTask: TestTask): string[] {
  return [testTaskSummary(testTask), ...testTask.ticketTests.map((test) => `-${ticketTestSummary(test)}`)]
}

export function transitionToNextStatus(status: Status) {
  switch (status) {
    case 'todo':
      return 'in progress'
    case 'in progress':
      return 'done'
    case 'done':
      return 'todo'
  }
}
