import { GenericTask } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'

type GenericTaskEditorProperties = {
  task: GenericTask
}

export function GenericTaskEditor(props: GenericTaskEditorProperties) {
  const task = props.task
  return (
    <>
      <StatusToggle status={task.status} />
      {task.name}
    </>
  )
}
