import { llmsText } from '#shared/llms'

import { brand } from '../../app/brand'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  const builtOn = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  return llmsText(
    { name: brand.name, url: brand.siteUrl, tagline: brand.tagline },
    await loadCatalog(),
    builtOn,
  )
})
