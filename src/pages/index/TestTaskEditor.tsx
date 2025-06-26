import { Tester, testersToString, TestTask, testTaskSummary, ticketToShortString } from '../../core/ReleaseTasks'
import { StatusToggle } from './StatusToggle'
import { client } from '../../../trpc/client'
import { TestersSelect } from './TestersSelect'
import { ExternalLink } from './ExternalLink'

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
        {task.ticketTests.map((ticketTest) => {
          const ticket = ticketTest.ticket
          return (
            <li key={ticket.identifier}>
              <StatusToggle
                status={ticketTest.status}
                onChange={async (status) => {
                  const identifier = ticket.identifier
                  await client.ticketTest.setStatus
                    .mutate({ identifier, status })
                    .then(() => {
                      window.location.reload()
                    })
                    .catch((e) => console.log(e))
                }}
              />
              {' ' + ticketToShortString(ticket)}
              {ticket.kind === 'ticket' && <ExternalLink destination={ticket.url} />}
              {' ' + testersToString(ticketTest.testers)}
              <TestersSelect
                availableTesters={props.testers}
                assignedTesters={ticketTest.testers}
                onChange={async (testers) => {
                  const identifier = ticket.identifier
                  await client.ticketTest.setTesters
                    .mutate({ identifier, testers })
                    .then(() => {
                      window.location.reload()
                    })
                    .catch((e) => console.log(e))
                }}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}
