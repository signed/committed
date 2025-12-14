import { Tester, TestTask, testTaskSummary } from '../../core/ReleaseTasks'
import { TicketTestEditor } from './TicketTestEditor'

type TestTaskEditorProperties = {
  testTask: TestTask
  testers: Tester[]
}

export function TestTaskEditor(props: TestTaskEditorProperties) {
  const { testTask, testers } = props
  return (
    <>
      {testTaskSummary(testTask)}
      <ul>
        {testTask.ticketTests.map((ticketTest) => {
          const ticket = ticketTest.ticket

          return (
            <li key={ticket.identifier}>
              <TicketTestEditor ticketTest={ticketTest} testers={testers} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
