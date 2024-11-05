import { Status, Task } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'
import { TestTaskEditor } from './TestTaskEditor'
import { GenericTaskEditor } from './GenericTaskEditor'

export type TaskSectionProperties = {
  tasks: Task[]
}

export const TaskSection = (_props: TaskSectionProperties) => {
  return (
    <>
      <StatusToggle status={'todo'} onChange={(status: Status) => console.log(status)} />
      <ol>{_props.tasks.map((task) => summaryFor(task))}</ol>
    </>
  )
}

function summaryFor(task: Task) {
  switch (task.type) {
    case 'generic':
      return (
        <li key={task.name}>
          <GenericTaskEditor task={task}></GenericTaskEditor>
        </li>
      )
    case 'test':
      return (
        <li key={'test'}>
          <TestTaskEditor task={task}></TestTaskEditor>
        </li>
      )
  }
}
