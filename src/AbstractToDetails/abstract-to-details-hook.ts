import { useContext, createContext } from 'react'

export const AbstractToDetailContext = createContext<AbstractToDetailData | undefined>(undefined)

export type AbstractToDetailData = {
  selected: string
  displayDetailsFor: (identifier: string) => void
}

export const useAbstractToDetail = () => {
  const data = useContext(AbstractToDetailContext)
  if (data === undefined) {
    throw new Error('has ')
  }
  return data
}
