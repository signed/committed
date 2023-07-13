import { Author, TicketDetails, TicketIdentifierToDetails } from './ExtractReferencedTicketUrls'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
}

type AuthorWithCommitCount = { name: Author; count: number }

const authorsByCommits = (details: TicketDetails) => {
  const commits = details.commits
  const statistic = commits.reduce((a, c) => {
    const author = c.author
    let commits = a.get(author)
    if (commits === undefined) {
      commits = { name: author, count: 0 }
      a.set(author, commits)
    }
    ++commits.count
    return a
  }, new Map<Author, AuthorWithCommitCount>())
  return Array.from(statistic.values()).sort((left, right) => right.count - left.count)
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
