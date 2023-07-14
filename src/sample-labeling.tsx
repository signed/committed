export type Treeish = string

export type CommitRange = {
  from: Treeish
  to: Treeish
}

export type GitRangeProps = { range: CommitRange }

export function GitRange(props: GitRangeProps) {
  return <div>{props.range.from + '...' + props.range.to}</div>
}

export type SampleLabelingProps = {
  project: string
  range: CommitRange
}

export function SampleLabeling(props: SampleLabelingProps) {
  return (
    <div>
      <div>{props.project + ' / '}</div>
      <GitRange range={props.range}></GitRange>
    </div>
  )
}
