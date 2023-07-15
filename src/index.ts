import 'dotenv/config'

import { loadConfigurationFrom } from '../server/configuration'
import { extractReferencedTicketUrls } from './pages/index/ExtractReferencedTicketUrls'

const configuration = loadConfigurationFrom(process.env)
if (configuration === 'failed') {
  console.log('project, from and to are mandatory')
  process.exit(1)
}

//@ts-expect-error running on node 20 where this is supported but still have to figure out tsconfig setup
const ticketLinks = await extractReferencedTicketUrls(configuration)
console.log(ticketLinks)
