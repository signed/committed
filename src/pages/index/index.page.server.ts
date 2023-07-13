import type { PageContextServer } from '../../renderer/types'
import { extractReferencedTicketUrls } from './ExtractReferencedTicketUrls'
import type { PageProperties } from './index.page'

export async function onBeforeRender(context: PageContextServer) {
  const ticketLinks = await extractReferencedTicketUrls(context.configuration)
  const pageProps: PageProperties = {
    ticketIdentifierToDetails: ticketLinks,
  }
  return {
    pageContext: {
      pageProps,
    },
  }
}
