import { NoTicketIdentifier, TicketIdentifier } from '../src/core/ExtractReferencedTicketUrls'
import { Status, Task, Tester } from '../src/core/ReleaseTasks'
import { TaskStorage } from '../src/core/TaskStorage'

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

  async transitionTicketTest(ticketIdentifier: TicketIdentifier | NoTicketIdentifier, status: Status): Promise<void> {
    if (this.tasks === 'empty') {
      return
    }
    this.tasks = this.tasks.map((task) => {
      if (task.type === 'test') {
        const ticketTests = task.ticketTests.map((test) => {
          if (test.ticket.identifier === ticketIdentifier) {
            return { ...test, status }
          }
          return test
        })
        return { ...task, ticketTests }
      }
      return task
    })
  }

  async assignTestersToTicketTest(
    ticketIdentifier: TicketIdentifier | NoTicketIdentifier,
    testers: Tester[],
  ): Promise<void> {
    if (this.tasks === 'empty') {
      return
    }
    this.tasks = this.tasks.map((task) => {
      if (task.type === 'test') {
        const ticketTests = task.ticketTests.map((test) => {
          if (test.ticket.identifier === ticketIdentifier) {
            return { ...test, testers }
          }
          return test
        })
        return { ...task, ticketTests }
      }
      return task
    })
  }
}
