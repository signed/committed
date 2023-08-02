import type { PageContextServer } from '../../renderer/types'
import { extractReferencedTicketUrls } from './ExtractReferencedTicketUrls'
import type { PageProperties } from './+Page'

async function onBeforeRender(context: PageContextServer) {
  const ticketLinks = await extractReferencedTicketUrls(context.configuration)
  const repository = context.configuration.repository
  const pageProps: PageProperties = {
    ticketIdentifierToDetails: ticketLinks,
    project: context.project,
    range: {
      from: repository.from,
      to: repository.to,
    },
  }
  return {
    pageContext: {
      pageProps,
    },
  }
}

export default onBeforeRender
