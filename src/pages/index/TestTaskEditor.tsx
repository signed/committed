import { testersToString, TestTask, testTaskSummary, ticketToString } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'

type TestTaskEditorProperties = {
  task: TestTask
}

export function TestTaskEditor(props: TestTaskEditorProperties) {
  const task = props.task
  return (
    <>
      {testTaskSummary(task)}
      <ul>
        {task.ticketTests.map((ticketTest) => (
          <li key={ticketTest.ticket.identifier}>
            <StatusToggle status={ticketTest.status} />
            {`${ticketToString(ticketTest.ticket)} ${testersToString(ticketTest.tester)}`}
          </li>
        ))}
      </ul>
    </>
  )
}
