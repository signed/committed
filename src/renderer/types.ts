import { Configuration } from '../../server/configuration'

export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }

import type {
  PageContextBuiltIn,
  /*
    // When using Client Routing https://vike.dev/clientRouting
    PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
    /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
  //*/
} from 'vike/types'
import { TaskStorage } from '../pages/index/TaskStorage'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
  project: string
  configuration: Configuration
  taskStorage: TaskStorage
  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
}

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
