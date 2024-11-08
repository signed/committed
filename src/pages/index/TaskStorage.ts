import { Status, Task } from '../../core/ReleaseTasks'
import { NoTicket, Ticket } from '../../core/ExtractReferencedTicketUrls'

export interface TaskStorage {
  loadTasks(): Promise<Task[] | 'empty'>

  storeTasks(tasks: Task[]): Promise<void>

  transitionTaskStatus(taskName: string, status: Status): Promise<void>

  //todo Convert to TicketIdentifier | NoTicketIdentifier
  transitionTicketTest(ticket: Ticket | NoTicket, status: Status): Promise<void>
}
