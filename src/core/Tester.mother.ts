import { Tester } from './ReleaseTasks'

export function anyTester(overrides: Partial<Tester> = {}): Tester {
  return {
    full: 'Full Tester',
    first: 'Full',
    last: 'Tester',
    ...overrides,
  }
}
