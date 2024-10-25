import { type CSSProperties } from 'react'
import { CommitRange } from './core/project'
import { GitRangeView } from './git-range-view'
import { type TimeSpan } from './commits'
import { fullDaysBetween } from './core/dates'

export type SampleLabelingViewProps = {
  project: string
  range: CommitRange
  timeSpan: TimeSpan
}

const style: CSSProperties = {
  marginLeft: '1em',
}

export function SampleLabelingView(props: SampleLabelingViewProps) {
  const { timeSpan } = props
  const days = fullDaysBetween(timeSpan.earliest, timeSpan.latest)
  return (
    <div>
      <div>
        <span>{props.project}</span>
        <span style={style}> {days} days</span>
        <span style={style}>
          ({timeSpan.earliest.toLocaleDateString() + ' - ' + timeSpan.latest.toLocaleDateString()})
        </span>
      </div>
      <GitRangeView range={props.range}></GitRangeView>
    </div>
  )
}
