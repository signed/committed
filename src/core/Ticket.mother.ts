import { Ticket } from './ExtractReferencedTicketUrls'

export function anyTicket(overrides: Partial<Ticket> = {}): Ticket {
  const identifier = 'TID'
  return {
    kind: 'ticket',
    identifier,
    summary: 'Stand in Summary',
    authors: new Set(),
    url: `http://example.org/${identifier}`,
    ...overrides,
  }
}
