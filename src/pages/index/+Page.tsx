import { NoTicket, type Ticket, TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../core/project'
import '../../AbstractToDetails/AbstractToDetails.css'
import { timeSpanOver } from '../../core/commits'
import { Status, Task, TestTask, TicketTest } from '../../core/ReleaseTasks'
import { TaskSection } from './TaskSection'
import { ReferencedTickets } from './ReferencedTickets'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
  releaseTasks: Task[]
}

const statusToEmote = (status: Status) => {
  switch (status) {
    case 'todo':
      return '⏳'
    case 'in progress':
      return '▶️'
    case 'done':
      return '✅'
  }
}

const ticketToString = (ticket: Ticket | NoTicket) => {
  if (ticket.kind === 'no-ticket') {
    return '[no ticket]'
  }
  return ticket.url
}

function testersToString(testers: string[]) {
  return testers.join(', ')
}

const overallTestStatus = (ticketTests: TicketTest[]): Status => {
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

function deriveTestLinesFrom(testTask: TestTask): string[] {
  const ticketTests = testTask.ticketTests
  const status = overallTestStatus(ticketTests)

  return [
    `${statusToEmote(status)} Test`,
    ...ticketTests.map((test) => {
      return `-${statusToEmote(test.status)} ${ticketToString(test.ticket)} ${testersToString(test.tester)}`
    }),
  ]
}

const produceMessage = (releaseTasks: Task[]) => {
  const lines = releaseTasks.flatMap((task) => {
    const type = task.type
    switch (type) {
      case 'generic':
        return `${statusToEmote(task.status)} ${task.name}`
      case 'test':
        return deriveTestLinesFrom(task)
    }
  })
  const message = lines.join('\n')
  return { message, lineCount: lines.length }
}

function Page(props: PageProperties) {
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return null
  }
  const { message, lineCount } = produceMessage(props.releaseTasks)
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Release Tasks</h1>
      <textarea rows={lineCount + 3} cols={80} defaultValue={message} />
      <TaskSection tasks={props.releaseTasks} />
      <h1>Referenced Tickets</h1>
      <ReferencedTickets ticketIdentifierToDetails={props.ticketIdentifierToDetails}></ReferencedTickets>
    </>
  )
}

export default Page
