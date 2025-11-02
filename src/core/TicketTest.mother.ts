import { TicketTest } from './ReleaseTasks'
import { anyStatus } from './Status.mother'
import { anyTicket } from './Ticket.mother'
import { anyTester } from './Tester.mother'

export function anyTicketTest(overrides: Partial<TicketTest>): TicketTest {
  return {
    required: true,
    status: anyStatus(),
    ticket: anyTicket(),
    testers: [anyTester()],
    ...overrides,
  }
}
