import { Tester, testersToString, TestTask, testTaskSummary, ticketToString } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'
import { client } from '../../../trpc/client'
import { TestersSelect } from './TestersSelect'

type TestTaskEditorProperties = {
  task: TestTask
  testers: Tester[]
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
            {`${ticketToString(ticketTest.ticket)} ${testersToString(ticketTest.testers)}`}
            <TestersSelect
              availableTesters={props.testers}
              assignedTesters={ticketTest.testers}
              onChange={async (testers) => {
                const identifier = ticketTest.ticket.identifier
                await client.ticketTest.setTesters
                  .mutate({ identifier, testers })
                  .then(() => {
                    window.location.reload()
                  })
                  .catch((e) => console.log(e))
              }}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
