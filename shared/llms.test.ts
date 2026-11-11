import { describe, expect, it } from 'vitest'

import { llmsText } from './llms'
import { buildCatalog, money } from './plans'
import fixture from './plans.fixture.json'

const site = { name: 'Fitness', url: 'https://fitness.codart.dev', tagline: 'Seu diário' }
const catalog = buildCatalog(fixture)
const text = llmsText(site, catalog, '26/10/2026')

describe('llmsText', () => {
  it('takes prices and trial length from the plans contract', () => {
    expect(text).toContain(`Teste grátis: ${catalog.trialDays} dias`)
    expect(text).toContain(`${money(2990, 'pt')} por mês ou ${money(19990, 'pt')} por ano`)
    expect(text).toContain('válidos em 26/10/2026')
  })

  it('says Premium Pro is coming while its sale is off, and its packages once it is on', () => {
    expect(text).toContain('- Premium Pro: em breve')
    const onSale = buildCatalog({
      ...fixture,
      plans: [
        fixture.plans[0],
        {
          id: 'coaching',
          name: 'Premium Pro',
          available: true,
          packages: [{ months: 6, totalCents: 49990, installments: 6, perMonthCents: 8332 }],
        },
      ],
    })
    expect(llmsText(site, onSale, '26/10/2026')).toContain(
      `6 meses por ${money(49990, 'pt')} (6x de ${money(8332, 'pt')})`,
    )
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
