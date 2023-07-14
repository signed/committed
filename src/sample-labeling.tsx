export type Treeish = string

export type CommitRange = {
  from: Treeish
  to: Treeish
}

export type SampleLabelingProps = {
  project: string
  range: CommitRange
}

export function SampleLabeling(props: SampleLabelingProps) {
  return (
    <div>
      <div>{props.project}</div>
      <div>
        <ul>
          <li>{props.range.from}</li>
          <li>{props.range.from}</li>
        </ul>
      </div>
    </div>
  )
}
