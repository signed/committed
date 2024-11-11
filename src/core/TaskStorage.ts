import { Status, Task, Tester } from './ReleaseTasks'
import { NoTicketIdentifier, TicketIdentifier } from './ExtractReferencedTicketUrls'

export interface TaskStorage {
  loadTasks(): Promise<Task[] | 'empty'>

  storeTasks(tasks: Task[]): Promise<void>

  transitionTaskStatus(taskName: string, status: Status): Promise<void>

  transitionTicketTest(ticketIdentifier: TicketIdentifier | NoTicketIdentifier, status: Status): Promise<void>

  assignTestersToTicketTest(ticketIdentifier: TicketIdentifier | NoTicketIdentifier, testers: Tester[]): Promise<void>
}
