import { TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { AbstractToDetail } from '../../AbstractToDetails/abstract-to-detail'
import { TicketSummaryView } from './TicketSummaryView'
import { TicketDetailsView } from './TicketDetailsView'

export type ReferencedTicketsProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
}

export const ReferencedTickets = (props: ReferencedTicketsProperties) => {
  const first = Array.from(props.ticketIdentifierToDetails.keys())[0]
  if (first === undefined) {
    return <div>nothing to display</div>
  }
  return (
    <>
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
    </>
  )
}
