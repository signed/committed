import { CommitsContainer, NoTicket, type Ticket, TicketIdentifier } from './ExtractReferencedTicketUrls'

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

export const deriveReleaseTasks = (ticketIdentifierToDetails: Map<TicketIdentifier, CommitsContainer>): Task[] => {
  const testTasks = Array.from(ticketIdentifierToDetails.entries()).map(([_, v]) => {
    return {
      type: 'test',
      required: true,
      status: 'todo',
      ticket: v.ticket,
      tester: v.commits.map((commit) => commit.author),
    } satisfies TestTask
  })
  return [
    { type: 'generic', status: 'done', name: 'build artifact' },
    { type: 'generic', status: 'in progress', name: 'deploy staging' },
    ...testTasks,
    { type: 'generic', status: 'todo', name: 'deploy production' },
  ]
}
