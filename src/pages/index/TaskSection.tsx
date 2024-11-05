import { genericTaskSummary, Task, testTaskSummary, ticketTestSummary } from '../../core/ReleaseTasks'

export type TaskSectionProperties = {
  tasks: Task[]
}

function summaryFor(task: Task) {
  switch (task.type) {
    case 'test':
      return (
        <li key={'test'}>
          {testTaskSummary(task)}
          <ul>
            {task.ticketTests.map((t) => (
              <li key={t.ticket.identifier}>{ticketTestSummary(t)}</li>
            ))}
          </ul>
        </li>
      )
    case 'generic':
      return <li key={task.name}>{genericTaskSummary(task)}</li>
  }
}

export const TaskSection = (_props: TaskSectionProperties) => {
  return <ol>{_props.tasks.map((task) => summaryFor(task))}</ol>
}
