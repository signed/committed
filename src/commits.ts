import { Author, Commit, CommitsContainer, TicketIdentifierToDetails } from './pages/index/ExtractReferencedTicketUrls'

export type AuthorWithCommitCount = { name: Author; count: number }

export const authorsByCommits = (details: CommitsContainer) => {
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

export type TimeSpan = {
  earliest: Date
  latest: Date
}

const allCommitsIn = (details: TicketIdentifierToDetails): Commit[] => {
  return Array.from(details.values()).flatMap((details) => details.commits)
}

export const timeSpanOver = (details: TicketIdentifierToDetails): TimeSpan | undefined => {
  const commits = allCommitsIn(details)
  const firstCommit = commits[0]
  if (firstCommit === undefined) {
    return undefined
  }
  const timeSpan = {
    earliest: firstCommit.authorDate,
    latest: firstCommit.authorDate,
  }
  return commits.reduce((acc, cur) => {
    if (cur.authorDate < acc.earliest) {
      acc.earliest = cur.authorDate
    }
    if (cur.authorDate > acc.latest) {
      acc.latest = cur.authorDate
    }
    return acc
  }, timeSpan)
}
