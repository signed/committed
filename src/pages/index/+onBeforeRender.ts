import type { PageContextServer } from '../../renderer/types'
import { extractReferencedTicketUrls } from '../../core/ExtractReferencedTicketUrls'
import type { PageProperties } from './+Page'
import { deriveReleaseTasks } from '../../core/ReleaseTasks'

const loadPageProperties = async (context: PageContextServer) => {
  const ticketIdentifierToDetails = await extractReferencedTicketUrls(context.configuration)
  let releaseTasks = await context.taskStorage.loadTasks()
  if (releaseTasks === 'empty') {
    releaseTasks = deriveReleaseTasks(ticketIdentifierToDetails, context.configuration.release)
    await context.taskStorage.storeTasks(releaseTasks)
  }
  const repository = context.configuration.repository
  const range = {
    from: repository.from,
    to: repository.to,
  }
  const project = context.project
  return {
    ticketIdentifierToDetails,
    project,
    range,
    releaseTasks,
    testers: context.configuration.release.testers,
  } satisfies PageProperties
}

async function onBeforeRender(context: PageContextServer) {
  const pageProps = await loadPageProperties(context)
  return {
    pageContext: {
      pageProps,
    },
  }
}

export default onBeforeRender
