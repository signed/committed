import * as React from 'react'

export function ExternalLink(props: { text: string; destination: string }) {
  return (
    <>
      <span>{props.text}</span>
      <a href={props.destination} target="_blank" rel="noreferrer">
        <ExternalLinkIcon />
      </a>
    </>
  )
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" {...props}>
      <path d="M13 3l3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z" />
      <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z" />
    </svg>
  )
}
