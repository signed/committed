import { TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
}

export function Page(properties: PageProperties) {
  return (
    <>
      <h1>Referenced Tickets</h1>
      <ul>
        {Array.from(properties.ticketIdentifierToDetails).map(([ticketIdentifier, details]) => {
          return (
            <li key={ticketIdentifier}>
              <a href={details.ticket.url} target="_blank" rel="noreferrer">
                {ticketIdentifier}
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
