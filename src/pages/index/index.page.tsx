import { TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'
import { authorsByCommits } from '../../commits'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../project'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
}

export function Page(props: PageProperties) {
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range}></SampleLabelingView>
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
