import { TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'
import { authorsByCommits } from '../../commits'
import { CommitRange, SampleLabeling } from '../../sample-labeling'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
}

export function Page(props: PageProperties) {
  return (
    <>
      <SampleLabeling project={props.project} range={props.range}></SampleLabeling>
      <h1>Referenced Tickets</h1>
      <ul>
        {Array.from(props.ticketIdentifierToDetails).map(([ticketIdentifier, details]) => {
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
