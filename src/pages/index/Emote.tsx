export type EmoteProps = {
  children: string
  onClick?: () => void
}

const doNothing = () => {}

export const Emote = (props: EmoteProps) => {
  return <span onClick={props.onClick ?? doNothing}>{props.children}</span>
}
