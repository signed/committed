import { Task } from '../../core/ReleaseTasks'
import { TestTaskEditor } from './TestTaskEditor'
import { GenericTaskEditor } from './GenericTaskEditor'

export type TaskSectionProperties = {
  tasks: Task[]
}

export const TaskSection = (_props: TaskSectionProperties) => {
  return (
    <>
      <ol>
        {_props.tasks.map((task) => {
          return <li key={task.name}>{editorFor(task)}</li>
        })}
      </ol>
    </>
  )
}

function editorFor(task: Task) {
  switch (task.type) {
    case 'generic':
      return <GenericTaskEditor task={task} />
    case 'test':
      return <TestTaskEditor task={task} />
  }
}
