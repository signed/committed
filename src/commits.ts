import { Author, TicketDetails } from './pages/index/ExtractReferencedTicketUrls'

export type AuthorWithCommitCount = { name: Author; count: number }

export const authorsByCommits = (details: TicketDetails) => {
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
