import { TicketIdentifier } from './pages/index/ExtractReferencedTicketUrls'

export type Treeish = string
export type CommitRange = {
  from: Treeish
  to: Treeish
}

export const extractTicketReferencesFrom = (subject: string, projectKey: string): TicketIdentifier[] => {
  const re = new RegExp(`${projectKey}-\\d+`, 'g')
  const match = subject.matchAll(re)
  return Array.from(match).map((i) => i[0])
}
