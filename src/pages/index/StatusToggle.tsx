import { Status, statusToEmote, transitionToNextStatus } from '../../core/ReleaseTasks'

type StatusToggleProperties = {
  status: Status
  onChange?: (status: Status) => void
}

export function StatusToggle(props: StatusToggleProperties) {
  const handleClick = () => {
    const newStatus = transitionToNextStatus(props.status)
    props.onChange?.(newStatus)
  }
  return <span onClick={handleClick}>{statusToEmote(props.status)}</span>
}
