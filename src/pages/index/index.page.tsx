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

export function Page(props: PageProperties) {
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return null
  }
  const first = Array.from(props.ticketIdentifierToDetails.keys())[0]
  if (first === undefined) {
    return <div>nothing to display</div>
  }

  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Referenced Tickets</h1>
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
