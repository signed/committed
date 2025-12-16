import { Author, CommitsContainer, NoTicket, type Ticket, TicketIdentifier } from './ExtractReferencedTicketUrls'
import { ReleaseConfiguration, ReleaseTaskName } from '../../server/configuration'

export const StatusValues = ['todo', 'in progress', 'done'] as const

export type Status = (typeof StatusValues)[number]

type PreludeRenderer = () => string
type ContentEnvelope = (content: string) => string
type TicketRenderer = (ticket: Ticket | NoTicket) => string
type TicketRenderers = {
  link: TicketRenderer
  summary: TicketRenderer
}
type LineBreak = () => string

export type Renderer = {
  preludeRenderer?: PreludeRenderer
  contentEnvelope?: ContentEnvelope
  ticketRenderer: TicketRenderers
  lineBreak: LineBreak
}

const ticketToHtml: TicketRenderers = {
  link: (ticket: Ticket | NoTicket) => {
    if (ticket.kind === 'no-ticket') {
      return '[no ticket]'
    }
    return `<a href="${ticket.url}" target="_blank" rel="noopener nofollow noreferrer">${ticket.identifier}</a>`
  },
  summary: (ticket: Ticket | NoTicket) => {
    if (ticket.kind === 'no-ticket') {
      return ''
    }

    return `${ticket.summary}`
  },
}

const ticketToString = {
  link: (ticket: Ticket | NoTicket) => {
    if (ticket.kind === 'no-ticket') {
      return '[no ticket]'
    }
    return `${ticket.url}`
  },
  summary: (ticket: Ticket | NoTicket) => {
    if (ticket.kind === 'no-ticket') {
      return ''
    }
    return `${ticket.summary}`
  },
}
export const htmlRenderer: Renderer = {
  preludeRenderer: () => '<meta charset="utf-8">',
  contentEnvelope: (content) => `<span>${content}</span>`,
  ticketRenderer: ticketToHtml,
  lineBreak: () => '<br>',
}

export const textRenderer: Renderer = {
  ticketRenderer: ticketToString,
  lineBreak: () => '\n',
}

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
  const testers = [...container.ticket.authors].map(authorToTester)
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
  const onlyRequired = testTask.ticketTests.filter((it) => it.required)
  const atLeastOneInProgress = onlyRequired.some((test) => statusFor(test) === 'in progress')
  if (atLeastOneInProgress) {
    return 'in progress'
  }
  const allDone = onlyRequired.every((test) => statusFor(test) === 'done')
  if (allDone) {
    return 'done'
  }
  return 'todo'
}

export const ticketTestToEmote = (ticketTest: TicketTest) => {
  if (!ticketTest.required) {
    return '⚪'
  }
  return statusToEmote(ticketTest.status)
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

export function testersFor(ticketTest: TicketTest) {
  if (!ticketTest.required) {
    return ''
  }
  return ticketTest.testers.map((tester) => tester.full).join(', ')
}

export function testTaskSummary(testTask: TestTask) {
  const status = overallTestStatus(testTask)
  return `${statusToEmote(status)} Test`
}

export function ticketTestSummary(ticketTest: TicketTest, ticketRenderers: TicketRenderers) {
  const emote = ticketTestToEmote(ticketTest)
  const link = ticketRenderers.link(ticketTest.ticket)
  const parts = ['-', emote, link]
  if (!ticketTest.required) {
    parts.push('[NO TEST]')
  }
  parts.push(ticketRenderers.summary(ticketTest.ticket))
  if (ticketTest.required) {
    parts.push(testersFor(ticketTest))
  }
  return parts.filter((it) => it.length > 0).join(' ')
}

export function statusFor(ticketTest: TicketTest) {
  if (!ticketTest.required) {
    return 'done'
  }
  return ticketTest.status
}

export function genericTaskSummary(task: GenericTask) {
  return `${statusToEmote(task.status)} ${task.name}`
}

export const render = (releaseTitle: string | undefined, releaseTasks: Task[], renderer: Renderer) => {
  const ticketRenderer = renderer.ticketRenderer
  const preludeRenderer = renderer.preludeRenderer
  const prelude = preludeRenderer ? [preludeRenderer()] : []
  const title = releaseTitle ? [releaseTitle] : []
  const tasks = releaseTasks.flatMap((task) => {
    const type = task.type
    switch (type) {
      case 'generic':
        return genericTaskSummary(task)
      case 'test':
        return deriveTestLinesFrom(task, ticketRenderer)
    }
  })

  const identity = (content: string) => content
  const contentEnvelope = renderer.contentEnvelope ?? identity
  const contentLines = [...title, ...tasks]
  const content = contentEnvelope(contentLines.join(renderer.lineBreak()))
  const lines = [...prelude, content]
  const message = lines.join('')
  return { message, lineCount: prelude.length + contentLines.length }
}

function deriveTestLinesFrom(testTask: TestTask, ticketRenderers: TicketRenderers): string[] {
  const summary = testTaskSummary(testTask)
  const testTasks = testTask.ticketTests.map((test) => ticketTestSummary(test, ticketRenderers))
  return [summary, ...testTasks]
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

export type Format = 'text/plain' | 'text/html'

export function rendererFor(format: Format) {
  if (format === 'text/plain') {
    return textRenderer
  }
  return htmlRenderer
}
