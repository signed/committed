import React, { type CSSProperties } from 'react'
import { AbstractToDetailContext } from './abstract-to-details-hook'

const Abstract = function (props: { children: React.ReactNode }) {
  return <div>{props.children}</div>
}

const Detail = function (props: { children: React.ReactNode }) {
  return <div>{props.children}</div>
}

const abstractToDetailStyle = {
  display: 'flex',
  flexDirection: 'row',
} as CSSProperties

export function AbstractToDetail(props: { initial: string; children: React.ReactNode }) {
  const [selected, displayDetailsFor] = React.useState(props.initial)

  return (
    <AbstractToDetailContext.Provider value={{ selected, displayDetailsFor }}>
      <div style={abstractToDetailStyle}>{props.children}</div>
    </AbstractToDetailContext.Provider>
  )
}

AbstractToDetail.Abstract = Abstract
AbstractToDetail.Detail = Detail
