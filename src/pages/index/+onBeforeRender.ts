import type { PageContextServer } from '../../renderer/types'
import { extractReferencedTicketUrls } from '../../core/ExtractReferencedTicketUrls'
import type { PageProperties } from './+Page'
import { deriveReleaseTasks } from '../../core/ReleaseTasks'

async function onBeforeRender(context: PageContextServer) {
  const ticketIdentifierToDetails = await extractReferencedTicketUrls(context.configuration)
  const releaseTasks = deriveReleaseTasks(ticketIdentifierToDetails)
  const repository = context.configuration.repository
  const pageProps: PageProperties = {
    ticketIdentifierToDetails,
    project: context.project,
    range: {
      from: repository.from,
      to: repository.to,
    },
    releaseTasks,
  }
  return {
    pageContext: {
      pageProps,
    },
  }
}

export default onBeforeRender
