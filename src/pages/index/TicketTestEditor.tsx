import Box from '@mui/material/Box'
import { Status, statusFor, Tester, testersFor, TicketTest, ticketToShortString } from '../../core/ReleaseTasks'
import { client } from '../../../trpc/client'
import { StatusToggle } from './StatusToggle'
import { Emote } from './Emote'
import { ExternalLink } from './ExternalLink'
import { TestersSelect } from './TestersSelect'

type TicketTestEditorProps = {
  ticketTest: TicketTest
  testers: Tester[]
}
export const TicketTestEditor = (props: TicketTestEditorProps) => {
  const { ticketTest, testers } = props
  const { ticket } = ticketTest

  const enableStatusToggle = ticketTest.testers.length > 0
  const status = statusFor(ticketTest)

  const updateStatus = async (status: Status) => {
    const identifier = ticket.identifier
    await client.ticketTest.setStatus
      .mutate({ identifier, status })
      .then(() => {
        window.location.reload()
      })
      .catch((e) => console.log(e))
  }
  const onChange = enableStatusToggle ? updateStatus : () => {}
  const emote = ticketTest.required ? <StatusToggle status={status} onChange={onChange} /> : <Emote>⚪</Emote>
  return (
    <>
      <Box component="div">
        {emote}
        {' ' + ticketToShortString(ticket)}
        {ticket.kind === 'ticket' && <ExternalLink destination={ticket.url} />}
        {ticket.kind === 'ticket' && ' ' + ticket.summary}
        {' ' + testersFor(ticketTest)}
      </Box>
      <Box component="div" sx={{ pt: 1.5 }}>
        {'Authors: ' + [...ticketTest.ticket.authors].join(', ')}
      </Box>
      <TestersSelect
        availableTesters={testers}
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
    </>
  )
}
