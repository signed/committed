import { Configuration } from '../../../server/configuration'
import { simpleGit } from 'simple-git'
import { extractTicketReferencesFrom } from '../../project'

export type TicketIdentifier = string

export type Ticket = {
  identifier: TicketIdentifier
  url: string
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

export type TicketDetails = {
  ticket: Ticket
  commits: Commit[]
}
export type TicketIdentifierToDetails = Map<TicketIdentifier, TicketDetails>

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
    ticketIdentifiers.forEach((ticketIdentifier) => {
      let details = ticketToCommits.get(ticketIdentifier)
      if (details === undefined) {
        const ticket = {
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
