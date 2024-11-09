import { Configuration } from '../../server/configuration'
import { simpleGit } from 'simple-git'
import { extractTicketReferencesFrom } from './project'

export type TicketIdentifier = string
export type NoTicketIdentifier = 'no ticket'

export type Ticket = {
  kind: 'ticket'
  identifier: TicketIdentifier
  url: string
}

export type NoTicket = {
  kind: 'no-ticket'
  identifier: NoTicketIdentifier
}

export type Hash = string
export type Author = string
export type Subject = string

export type Commit = {
  hash: Hash
  author: Author
  subject: Subject
  authorDate: Date
}

export type CommitsContainer = {
  ticket: Ticket | NoTicket
  commits: Commit[]
}
export type TicketIdentifierToDetails = Map<TicketIdentifier, CommitsContainer>

export const extractReferencedTicketUrls = async (configuration: Configuration): Promise<TicketIdentifierToDetails> => {
  const git = simpleGit(configuration.repository.baseDirectory)
  const out = await git.log({
    format: { subject: '%s', author: '%an', dateString: '%aI', hash: '%H' },
    '--ancestry-path': null,
    from: configuration.repository.from,
    to: configuration.repository.to,
  })
  const commits = out.all.map((l) => ({
    hash: l.hash,
    author: l.author,
    subject: l.subject,
    authorDate: new Date(l.dateString),
  }))
  const ticketToCommits: TicketIdentifierToDetails = new Map()
  commits.forEach((commit: Commit) => {
    const ticketIdentifiers = extractTicketReferencesFrom(commit.subject, configuration.ticketing.project)
    if (ticketIdentifiers.length === 0) {
      const NoTicketKey = 'no ticket'
      let details = ticketToCommits.get(NoTicketKey)
      if (details === undefined) {
        const noTicket = { kind: 'no-ticket', identifier: 'no ticket' } satisfies NoTicket
        details = { ticket: noTicket, commits: [] }
        ticketToCommits.set(NoTicketKey, details)
      }
      details.commits.push(commit)
    }
    ticketIdentifiers.forEach((ticketIdentifier) => {
      let details = ticketToCommits.get(ticketIdentifier)
      if (details === undefined) {
        const ticket: Ticket = {
          kind: 'ticket',
          identifier: ticketIdentifier,
          url: configuration.ticketing.url + ticketIdentifier,
        }
        details = { ticket, commits: [] }
        ticketToCommits.set(ticketIdentifier, details)
      }
      details.commits.push(commit)
    })
  })
  return ticketToCommits
}
