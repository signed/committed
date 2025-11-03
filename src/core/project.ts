import { Commit, TicketIdentifier } from './ExtractReferencedTicketUrls'

export type Treeish = string
export type CommitRange = {
  from: Treeish
  to: Treeish
}

const projectKeyRegex = (projectKey: string) => new RegExp(`${projectKey}-\\d+`, 'g')

export const extractTicketReferencesFrom = (subject: string, projectKey: string): TicketIdentifier[] => {
  const match = subject.matchAll(projectKeyRegex(projectKey))
  return Array.from(match).map((i) => i[0])
}

export function extractSummaryFrom(commit: Commit, project: string) {
  const regExp = projectKeyRegex(project)
  return commit.subject.replaceAll(regExp, '').trim()
}
