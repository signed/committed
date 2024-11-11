import { testersToString, TestTask, testTaskSummary, ticketToString } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'
import { client } from '../../../trpc/client'
import { TestersSelect } from './TestersSelect'

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
            <StatusToggle
              status={ticketTest.status}
              onChange={async (status) => {
                const identifier = ticketTest.ticket.identifier
                await client.ticketTest.setStatus
                  .mutate({ identifier, status })
                  .then(() => {
                    window.location.reload()
                  })
                  .catch((e) => console.log(e))
              }}
            />
            {`${ticketToString(ticketTest.ticket)} ${testersToString(ticketTest.tester)}`}
            <TestersSelect />
          </li>
        ))}
      </ul>
    </>
  )
}
