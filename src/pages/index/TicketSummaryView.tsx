import { TicketDetails } from './ExtractReferencedTicketUrls'

import { ExternalLink } from './ExternalLink'
import { useAbstractToDetail } from '../../AbstractToDetails/abstract-to-details-hook'

export function TicketSummaryView(props: { className?: string; ticketDetails: TicketDetails }) {
  const { displayDetailsFor, selected } = useAbstractToDetail()
  const ticketIdentifier = props.ticketDetails.ticket.identifier
  const className = [props.className, selected === props.ticketDetails.ticket.identifier && 'active']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={className} onClick={() => displayDetailsFor(ticketIdentifier)}>
      <ExternalLink text={ticketIdentifier} destination={props.ticketDetails.ticket.url} />
    </div>
  )
}
