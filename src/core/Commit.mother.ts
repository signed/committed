import { Commit } from './ExtractReferencedTicketUrls'

export const anyCommit = (overrides: Partial<Commit> = {}): Commit => {
  return {
    hash: '#stand-in-hash',
    author: 'Stand In Author',
    authorDate: new Date(),
    subject: 'Stand in Subject',
    ...overrides,
  }
}
