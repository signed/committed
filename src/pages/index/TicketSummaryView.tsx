import { CommitsContainer } from './ExtractReferencedTicketUrls'

import { ExternalLink } from './ExternalLink'
import { useAbstractToDetail } from '../../AbstractToDetails/abstract-to-details-hook'

export function TicketSummaryView(props: { className?: string; ticketDetails: CommitsContainer }) {
  const { displayDetailsFor, selected } = useAbstractToDetail()
  const ticket = props.ticketDetails.ticket
  const className = [props.className, selected === ticket.identifier && 'active'].filter(Boolean).join(' ')
  return (
    <div className={className} onClick={() => displayDetailsFor(ticket.identifier)}>
      <span>{ticket.identifier}</span>
      {ticket.kind === 'ticket' && <ExternalLink destination={ticket.url} />}
    </div>
  )
}
