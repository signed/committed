import { describe, expect, test } from 'vitest'
import { overallTestStatus, Status, Tester, TestTask, TicketTest } from './ReleaseTasks'
import { Ticket } from './ExtractReferencedTicketUrls'

//todo move to dedicated mothers
function anyStatus(): Status {
  return 'done'
}

function anyTester(overrides: Partial<Tester> = {}): Tester {
  return {
    full: 'Full Tester',
    first: 'Full',
    last: 'Tester',
    ...overrides,
  }
}

function anyTicket(overrides: Partial<Ticket> = {}): Ticket {
  const identifier = 'TID'
  return {
    kind: 'ticket',
    identifier,
    url: `http://example.org/${identifier}`,
    ...overrides,
  }
}

function anyTicketTest(overrides: Partial<TicketTest>): TicketTest {
  return {
    required: true,
    status: anyStatus(),
    ticket: anyTicket(),
    testers: [anyTester()],
    ...overrides,
  }
}

function anyTestTask(overrides: Partial<Omit<TestTask, 'type' | 'name'>> = {}): TestTask {
  return {
    type: 'test',
    name: 'Test',
    ticketTests: [],
    ...overrides,
  }
}

describe('overallTestStatus', () => {
  test('done, if only no test required tasks are left', () => {
    const ticketTests = [anyTicketTest({ required: false, status: 'in progress' })]
    const testTask = anyTestTask({ ticketTests })

    expect(overallTestStatus(testTask)).toEqual('done')
  })
})
