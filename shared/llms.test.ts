import { describe, expect, it } from 'vitest'

import { llmsText } from './llms'
import { buildCatalog, money } from './plans'
import fixture from './plans.fixture.json'

const site = { name: 'Fitness', url: 'https://fitness.codart.dev', tagline: 'Seu assistente' }
const catalog = buildCatalog(fixture)
const text = llmsText(site, catalog, '26/10/2026')

describe('llmsText', () => {
  it('takes prices and trial length from the plans contract', () => {
    expect(text).toContain(`Teste grátis: ${catalog.trialDays} dias`)
    expect(text).toContain(`${money(2990, 'pt')} por mês ou ${money(19990, 'pt')} por ano`)
    expect(text).toContain(`em até 12x de ${money(1666, 'pt')} sem juros`)
    expect(text).toContain('válidos em 26/10/2026')
  })

  it('says Premium Pro is coming while its sale is off, and its program once it is on', () => {
    expect(text).toContain('- Premium Pro: em breve')
    const onSale = buildCatalog({
      ...fixture,
      plans: [
        fixture.plans[0],
        {
          id: 'coaching',
          name: 'Premium Pro',
          available: true,
          packages: [{ months: 12, totalCents: 47880, installments: 12, perMonthCents: 3990 }],
        },
      ],
    })
    expect(llmsText(site, onSale, '26/10/2026')).toContain(
      `12 meses por ${money(47880, 'pt')}, ou 12x de ${money(3990, 'pt')} sem juros`,
    )
  })

  it('lists every feature once', () => {
    for (const feature of catalog.coaching.features) {
      expect(text.split(`- ${feature.name} (`)).toHaveLength(2)
    }
  })

  it('names no professional behind Premium Pro', () => {
    expect(text).not.toMatch(/\bCRN\b|\bCREF\b|educador físico|profissiona/)
  })

  it('has no dashes, which read as machine text', () => {
    expect(text).not.toMatch(/[–—]/)
  })
})
