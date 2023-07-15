import './code.css'
import { CommitRange } from './project'

export type GitRangeViewProps = { range: CommitRange }

export function GitRangeView(props: GitRangeViewProps) {
  return <code>{props.range.from + '...' + props.range.to}</code>
}
