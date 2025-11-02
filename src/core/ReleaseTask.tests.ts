import { describe, expect, test } from 'vitest'
import { overallTestStatus } from './ReleaseTasks'
import { anyTicketTest } from './TicketTest.mother'
import { anyTestTask } from './TestTask.mother'

describe('overallTestStatus', () => {
  test('done, if only no test required tasks are left', () => {
    const ticketTests = [anyTicketTest({ required: false, status: 'in progress' })]
    const testTask = anyTestTask({ ticketTests })

    expect(overallTestStatus(testTask)).toEqual('done')
  })
})
