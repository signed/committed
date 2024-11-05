import { genericTaskSummary, Task, testTaskSummary } from '../../core/ReleaseTasks'

export type TaskSectionProperties = {
  tasks: Task[]
}

function summaryFor(task: Task): string {
  switch (task.type) {
    case 'test':
      return testTaskSummary(task)
    case 'generic':
      return genericTaskSummary(task)
  }
}

export const TaskSection = (_props: TaskSectionProperties) => {
  return (
    <ol>
      {_props.tasks.map((task) => (
        <li key={'k'}>{summaryFor(task)}</li>
      ))}
    </ol>
  )
}
