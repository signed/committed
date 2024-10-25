import { NoTicket, type Ticket, TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../core/project'
import '../../AbstractToDetails/AbstractToDetails.css'
import { AbstractToDetail } from '../../AbstractToDetails/abstract-to-detail'
import { TicketSummaryView } from './TicketSummaryView'
import { TicketDetailsView } from './TicketDetailsView'
import { timeSpanOver } from '../../core/commits'
import { Task } from '../../core/ReleaseTasks'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
  releaseTasks: Task[]
}

const statusToEmote = (status: Task) => {
  switch (status.status) {
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
  return [...new Set(testers)].join(', ')
}

const produceMessage = (releaseTasks: Task[]) => {
  return releaseTasks
    .map((task) => {
      const type = task.type
      switch (type) {
        case 'generic':
          return `${statusToEmote(task)} ${task.name}`
        case 'test':
          return `-${statusToEmote(task)} ${ticketToString(task.ticket)} ${testersToString(task.tester)}`
      }
    })
    .join('\n')
}

function Page(props: PageProperties) {
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return null
  }
  const first = Array.from(props.ticketIdentifierToDetails.keys())[0]
  if (first === undefined) {
    return <div>nothing to display</div>
  }

  const message = produceMessage(props.releaseTasks)
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Referenced Tickets</h1>
      <AbstractToDetail initial={first}>
        <AbstractToDetail.Abstract>
          {Array.from(props.ticketIdentifierToDetails).map(([ticketIdentifier, details]) => {
            return <TicketSummaryView key={ticketIdentifier} className="abstractitem" ticketDetails={details} />
          })}
        </AbstractToDetail.Abstract>
        <AbstractToDetail.Detail>
          <TicketDetailsView ticketIdentifierToDetails={props.ticketIdentifierToDetails} />
        </AbstractToDetail.Detail>
      </AbstractToDetail>

      <textarea rows={props.releaseTasks.length + 3} cols={80} defaultValue={message} />
    </>
  )
}

export default Page
