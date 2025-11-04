import 'dotenv/config'

import { loadConfigurationFrom } from '../server/configuration'
import { extractReferencedTicketUrls } from './core/ExtractReferencedTicketUrls'

const configuration = loadConfigurationFrom(process.env)
if (configuration === 'failed') {
  console.log('project, from and to are mandatory')
  process.exit(1)
}

const ticketLinks = await extractReferencedTicketUrls(configuration)
console.log(ticketLinks)
