import { Ticket } from './ExtractReferencedTicketUrls'

export function anyTicket(overrides: Partial<Ticket> = {}): Ticket {
  const identifier = 'TID'
  return {
    kind: 'ticket',
    identifier,
    url: `http://example.org/${identifier}`,
    ...overrides,
  }
}
