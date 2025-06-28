import { TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../core/project'
import '../../AbstractToDetails/AbstractToDetails.css'
import { timeSpanOver } from '../../core/commits'
import { Format, render, rendererFor, Task, Tester } from '../../core/ReleaseTasks'
import { TaskSection } from './TaskSection'
import { ReferencedTickets } from './ReferencedTickets'
import { useState } from 'react'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
  releaseTasks: Task[]
  testers: Tester[]
  releaseTitle: string | undefined
}

export function Page(props: PageProperties) {
  const [format, setFormat] = useState<Format>('text/html')
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return <div>No Commits</div>
  }
  const renderer = rendererFor(format)
  const { message, lineCount } = render(props.releaseTitle, props.releaseTasks, renderer)

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(message)
  }
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Release Tasks</h1>
      <div>
        <label>
          <input
            type="radio"
            value="text/plain"
            checked={format === 'text/plain'}
            onChange={() => {
              setFormat('text/plain')
            }}
          />
          text/plain
        </label>
        <label>
          <input
            type="radio"
            value="text/html"
            checked={format === 'text/html'}
            onChange={() => {
              setFormat('text/html')
            }}
          />
          text/html
        </label>
        <button onClick={() => onCopyToClipboard()}>Copy to clipboard</button>
      </div>

      <textarea rows={lineCount + 6} cols={80} value={message} />
      <TaskSection tasks={props.releaseTasks} testers={props.testers} />
      <h1>Referenced Tickets</h1>
      <ReferencedTickets ticketIdentifierToDetails={props.ticketIdentifierToDetails}></ReferencedTickets>
    </>
  )
}
