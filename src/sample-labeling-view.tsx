import { CommitRange } from './project'
import { GitRangeView } from './git-range-view'

export type SampleLabelingViewProps = {
  project: string
  range: CommitRange
}

export function SampleLabelingView(props: SampleLabelingViewProps) {
  return (
    <div>
      <div>{props.project}</div>
      <GitRangeView range={props.range}></GitRangeView>
    </div>
  )
}
