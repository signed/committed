import { ReferencedTicket } from './ExtractReferencedTicketUrls'

export type PageProperties = {
  referencedTickets: ReferencedTicket[]
}

export function Page(properties: PageProperties) {
  return (
    <>
      <h1>Referenced Tickets</h1>
      <ul>
        {properties.referencedTickets.map((ticket) => (
          <li key={ticket.ticketIdentifier}>
            <a href={ticket.ticketUrl} target="_blank" rel="noreferrer">
              {ticket.ticketIdentifier}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
