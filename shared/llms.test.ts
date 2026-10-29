import { describe, expect, it } from 'vitest'

import { llmsText } from './llms'
import { buildCatalog, money } from './plans'
import fixture from './plans.fixture.json'

const catalog = buildCatalog(fixture)
const text = llmsText(
  { name: 'Fitness', url: 'https://fitness.codart.dev', tagline: 'Seu diário' },
  catalog,
  '26/10/2026',
)

describe('llmsText', () => {
  it('takes prices and trial length from the plans contract', () => {
    expect(text).toContain(`Teste grátis: ${catalog.trialDays} dias`)
    expect(text).toContain(`${money(2990, 'pt')} por mês ou ${money(15900, 'pt')} por ano`)
    expect(text).toContain('válidos em 26/10/2026')
  })

  it('lists every feature once', () => {
    for (const feature of fixture.features) {
      expect(text.split(`- ${feature.name} (`)).toHaveLength(2)
    }
  })

  it('has no dashes, which read as machine text', () => {
    expect(text).not.toMatch(/[–—]/)
  })
})
