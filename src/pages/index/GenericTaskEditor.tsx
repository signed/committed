import { GenericTask, genericTaskSummary } from '../../core/ReleaseTasks'

type GenericTaskEditorProperties = {
  task: GenericTask
}

export function GenericTaskEditor(props: GenericTaskEditorProperties) {
  return genericTaskSummary(props.task)
}
