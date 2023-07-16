import { TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../project'
import '../../AbstractToDetails/AbstractToDetails.css'
import { AbstractToDetail } from '../../AbstractToDetails/abstract-to-detail'
import { TicketSummaryView } from './TicketSummaryView'
import { TicketDetailsView } from './TicketDetailsView'
import { timeSpanOver } from '../../commits'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
}

function How(props: { ticketIdentifierToDetails: TicketIdentifierToDetails }) {
  const first = Array.from(props.ticketIdentifierToDetails.keys())[0]
  if (first === undefined) {
    return <div>nothing to display</div>
  }
  return (
    <>
      <AbstractToDetail initial={first}>
        <AbstractToDetail.Abstract>
          {Array.from(props.ticketIdentifierToDetails).map(([ticketIdentifier, details]) => {
            return (
              <TicketSummaryView
                key={ticketIdentifier}
                className="abstractitem"
                ticketDetails={details}
              ></TicketSummaryView>
            )
          })}
        </AbstractToDetail.Abstract>
        <AbstractToDetail.Detail>
          <TicketDetailsView ticketIdentifierToDetails={props.ticketIdentifierToDetails} />
        </AbstractToDetail.Detail>
      </AbstractToDetail>
    </>
  )
}

export function Page(props: PageProperties) {
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return null
  }
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Referenced Tickets</h1>
      <How ticketIdentifierToDetails={props.ticketIdentifierToDetails}></How>
    </>
  )
}
