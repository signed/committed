import { Configuration } from '../../../server/configuration'
import { simpleGit } from 'simple-git'
import { extractTicketReferencesFrom } from '../../project.mjs'

export type ReferencedTicket = {
  ticketIdentifier: string
  ticketUrl: string
}

export const extractReferencedTicketUrls = async (configuration: Configuration): Promise<ReferencedTicket[]> => {
  const git = simpleGit(configuration.repository.baseDirectory)
  const out = await git.log({
    format: { subject: '%s' },
    '--ancestry-path': null,
    from: configuration.repository.from,
    to: configuration.repository.to,
  })
  const subjects = out.all.map((l) => l.subject)

  const ticketReferences = subjects.flatMap((subject) =>
    extractTicketReferencesFrom(subject, configuration.ticketing.project),
  )
  const uniqueTicketReferences = [...new Set(ticketReferences)]
  return uniqueTicketReferences.map((ticketIdentifier) => {
    const ticketUrl = configuration.ticketing.url + ticketIdentifier
    return { ticketIdentifier, ticketUrl }
  })
}
