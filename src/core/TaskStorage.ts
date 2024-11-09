import { Status, Task } from './ReleaseTasks'
import { NoTicketIdentifier, TicketIdentifier } from './ExtractReferencedTicketUrls'

export interface TaskStorage {
  loadTasks(): Promise<Task[] | 'empty'>

  storeTasks(tasks: Task[]): Promise<void>

  transitionTaskStatus(taskName: string, status: Status): Promise<void>

  transitionTicketTest(ticket: TicketIdentifier | NoTicketIdentifier, status: Status): Promise<void>
}
