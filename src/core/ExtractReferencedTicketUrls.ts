import { Configuration, GitRepositoryConfiguration, TicketingConfiguration } from '../../server/configuration'
import { simpleGit } from 'simple-git'
import { extractTicketReferencesFrom } from './project'

export type TicketIdentifier = string
export type NoTicketIdentifier = 'no ticket'

export type TicketUrl = string
export type TicketSummary = string

export type Ticket = {
  kind: 'ticket'
  identifier: TicketIdentifier
  url: TicketUrl
  summary: TicketSummary
}

export type NoTicket = {
  kind: 'no-ticket'
  identifier: NoTicketIdentifier
}

export type Hash = string
export type Author = string
export type Subject = string
export type Body = string

export type Commit = {
  hash: Hash
  author: Author
  authorDate: Date
  subject: Subject
  body?: Body
}

export type CommitsContainer = {
  ticket: Ticket | NoTicket
  commits: Commit[]
}
export type TicketIdentifierToDetails = Map<TicketIdentifier, CommitsContainer>

export const extractReferencedTicketUrls = async (configuration: Configuration): Promise<TicketIdentifierToDetails> => {
  const commits = await extractCommits(configuration.repository)
  return mapTicketsToCommits(commits, configuration.ticketing)
}

async function extractCommits(repository: GitRepositoryConfiguration): Promise<Commit[]> {
  const git = simpleGit(repository.baseDirectory)
  const output = await git.log({
    format: { subject: '%s', body: '%b', author: '%an', dateString: '%aI', hash: '%H' },
    '--ancestry-path': null,
    '--no-merges': null,
    from: repository.from,
    to: repository.to,
  })

  return output.all.map((l) => {
    const commit: Commit = {
      hash: l.hash,
      author: l.author,
      authorDate: new Date(l.dateString),
      subject: l.subject,
    }
    if (l.body !== '') {
      commit.body = l.body
    }
    return commit
  })
}

function mapTicketsToCommits(commits: Commit[], ticketing: TicketingConfiguration) {
  const ticketToCommits: TicketIdentifierToDetails = new Map()
  commits.forEach((commit: Commit) => {
    const ticketIdentifiers = extractTicketReferencesFrom(commit.subject, ticketing.project)
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
          url: ticketing.url + ticketIdentifier,
          summary: commit.subject,
        }
        details = { ticket, commits: [] }
        ticketToCommits.set(ticketIdentifier, details)
      }
      details.commits.push(commit)
    })
  })
  return ticketToCommits
}
