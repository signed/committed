import { TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'
import { authorsByCommits } from '../../commits'

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
              <ol>
                {authorsByCommits(details).map((author) => (
                  <li key={author.name}>{`${author.name} (#${author.count})`}</li>
                ))}
              </ol>
            </li>
          )
        })}
      </ul>
    </>
  )
}
