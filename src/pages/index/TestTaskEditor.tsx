import { TestTask, testTaskSummary, ticketTestSummary } from '../../core/ReleaseTasks'

type TestTaskEditorProperties = {
  task: TestTask
}

export function TestTaskEditor(props: TestTaskEditorProperties) {
  const task = props.task
  return (
    <>
      {testTaskSummary(task)}
      <ul>
        {task.ticketTests.map((t) => (
          <li key={t.ticket.identifier}>{ticketTestSummary(t)}</li>
        ))}
      </ul>
    </>
  )
}
