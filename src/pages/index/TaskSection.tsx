import { Task, Tester } from '../../core/ReleaseTasks'
import { TestTaskEditor } from './TestTaskEditor'
import { GenericTaskEditor } from './GenericTaskEditor'

export type TaskSectionProperties = {
  tasks: Task[]
  testers: Tester[]
}

export const TaskSection = (props: TaskSectionProperties) => {
  return (
    <>
      <ol>
        {props.tasks.map((task) => {
          return <li key={task.name}>{editorFor(task, props.testers)}</li>
        })}
      </ol>
    </>
  )
}

function editorFor(task: Task, testers: Tester[]) {
  switch (task.type) {
    case 'generic':
      return <GenericTaskEditor task={task} />
    case 'test':
      return <TestTaskEditor testTask={task} testers={testers} />
  }
}
