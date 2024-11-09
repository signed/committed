import { GenericTask } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'
import { client } from '../../../trpc/client'

type GenericTaskEditorProperties = {
  task: GenericTask
}

export function GenericTaskEditor(props: GenericTaskEditorProperties) {
  const task = props.task
  return (
    <>
      <StatusToggle
        status={task.status}
        onChange={async (status) => {
          await client.task.setStatus.mutate({ status, name: task.name })
          window.location.reload()
        }}
      />
      {task.name}
    </>
  )
}
