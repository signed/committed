import { Ticket, NoTicket } from '../src/core/ExtractReferencedTicketUrls'
import { Task, Status } from '../src/core/ReleaseTasks'
import { TaskStorage } from '../src/pages/index/TaskStorage'

export class InMemoryTaskStorage implements TaskStorage {
  private tasks: Task[] | 'empty'

  constructor() {
    this.tasks = 'empty'
  }

  async loadTasks(): Promise<Task[] | 'empty'> {
    return this.tasks
  }

  async storeTasks(tasks: Task[]): Promise<void> {
    this.tasks = tasks
  }

  async transitionTaskStatus(taskName: string, status: Status): Promise<void> {
    if (this.tasks === 'empty') {
      return
    }
    this.tasks = this.tasks.map((task) => {
      if (task.type === 'generic' && task.name === taskName) {
        return { ...task, status }
      }
      return task
    })
  }

  async transitionTicketTest(ticket: Ticket | NoTicket, status: Status): Promise<void> {
    if (this.tasks === 'empty') {
      return
    }
    this.tasks = this.tasks.map((task) => {
      if (task.type === 'test') {
        const ticketTests = task.ticketTests.map((test) => {
          if (test.ticket === ticket) {
            return { ...test, status }
          }
          return test
        })
        return { ...task, ticketTests }
      }
      return task
    })
  }
}
