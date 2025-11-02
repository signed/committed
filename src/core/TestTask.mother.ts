import { TestTask } from './ReleaseTasks'

export function anyTestTask(overrides: Partial<Omit<TestTask, 'type' | 'name'>> = {}): TestTask {
  return {
    type: 'test',
    name: 'Test',
    ticketTests: [],
    ...overrides,
  }
}
