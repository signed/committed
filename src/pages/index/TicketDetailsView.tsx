import { TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { authorsByCommits } from '../../core/commits'
import { useAbstractToDetail } from '../../AbstractToDetails/abstract-to-details-hook'

export function TicketDetailsView(props: { ticketIdentifierToDetails: TicketIdentifierToDetails }) {
  const { selected } = useAbstractToDetail()

  const details = props.ticketIdentifierToDetails.get(selected)
  if (details === undefined) {
    return <>no details</>
  }

  return (
    <>
      <ol>
        {authorsByCommits(details).map((author) => (
          <li key={author.name}>{`${author.name} (#${author.count})`}</li>
        ))}
      </ol>
      <ul>
        {details.commits.map((commit) => {
          return <li key={commit.hash}>{commit.subject}</li>
        })}
      </ul>
    </>
  )
}
