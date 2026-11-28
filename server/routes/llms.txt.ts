import { llmsText } from '#shared/llms'

import { brand } from '../../app/brand'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return llmsText(
    { name: brand.name, url: brand.siteUrl, tagline: brand.tagline.pt },
    await loadCatalog('pt'),
    new Date(),
  )
})
