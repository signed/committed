import { Status, statusToEmote, transitionToNextStatus } from '../../core/ReleaseTasks'
import { Emote } from './Emote'

type StatusToggleProperties = {
  status: Status
  onChange?: (status: Status) => void
}

export function StatusToggle(props: StatusToggleProperties) {
  const handleClick = () => {
    const newStatus = transitionToNextStatus(props.status)
    props.onChange?.(newStatus)
  }
  return <Emote onClick={handleClick}>{statusToEmote(props.status)}</Emote>
}
