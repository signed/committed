import { TicketIdentifierToDetails } from '../../core/ExtractReferencedTicketUrls'
import { SampleLabelingView } from '../../sample-labeling-view'
import { CommitRange } from '../../core/project'
import '../../AbstractToDetails/AbstractToDetails.css'
import { timeSpanOver } from '../../core/commits'
import { htmlRenderer, render, Task, Tester, textRenderer } from '../../core/ReleaseTasks'
import { TaskSection } from './TaskSection'
import { ReferencedTickets } from './ReferencedTickets'

export type PageProperties = {
  ticketIdentifierToDetails: TicketIdentifierToDetails
  project: string
  range: CommitRange
  releaseTasks: Task[]
  testers: Tester[]
  releaseTitle: string | undefined
}

export function Page(props: PageProperties) {
  const timeSpan = timeSpanOver(props.ticketIdentifierToDetails)
  if (timeSpan === undefined) {
    return <div>No Commits</div>
  }
  //const { message, lineCount } = render(props.releaseTitle, props.releaseTasks, textRenderer)
  const { message, lineCount } = render(props.releaseTitle, props.releaseTasks, htmlRenderer)

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(message)
  }
  return (
    <>
      <SampleLabelingView project={props.project} range={props.range} timeSpan={timeSpan}></SampleLabelingView>
      <h1>Release Tasks</h1>
      <button onClick={() => onCopyToClipboard()}>Copy to clipboard</button>
      <textarea rows={lineCount + 3} cols={80} defaultValue={message} />
      <TaskSection tasks={props.releaseTasks} testers={props.testers} />
      <h1>Referenced Tickets</h1>
      <ReferencedTickets ticketIdentifierToDetails={props.ticketIdentifierToDetails}></ReferencedTickets>
    </>
  )
}
