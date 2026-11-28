import { describe, expect, it } from 'vitest'

import { llmsText } from './llms'
import { buildCatalog, money } from './plans'
import fixture from './plans.fixture.json'

const site = { name: 'Fitness', url: 'https://myfitally.com', tagline: 'Seu assistente' }
const catalog = buildCatalog(fixture)
const BLACK_FRIDAY = new Date('2026-11-27T12:00:00-03:00')
const text = llmsText(site, catalog, BLACK_FRIDAY)

describe('llmsText', () => {
  it('takes prices and trial length from the plans contract', () => {
    expect(text).toContain(`Teste grátis com tudo do`)
    expect(text).toContain(`${money(2990, 'pt')} por mês ou ${money(23880, 'pt')} por ano`)
    expect(text).toContain(`em até 12x de ${money(1990, 'pt')} sem juros`)
    expect(text).toContain(`ou no Pix à vista, por ${money(21990, 'pt')}`)
    expect(text).toContain('válidos em 27/11/2026')
  })

  it('says the next prices with the day they take effect, while that day is ahead', () => {
    expect(text).toContain('A partir de 01/12/2026, à 0h de Brasília, os preços passam a ser:')
    expect(text).toContain(
      `- Premium: ${money(3990, 'pt')} por mês ou ${money(35880, 'pt')} por ano, em até 12x de ${money(2990, 'pt')} sem juros, ou ${money(32990, 'pt')} no Pix à vista.`,
    )
    expect(text).toContain(
      `- Premium Pro: 12 meses por ${money(71880, 'pt')}, ou 12x de ${money(5990, 'pt')} sem juros, ou ${money(64990, 'pt')} no Pix à vista.`,
    )
  })

  it('says the next prices as the prices once their day has come, with nothing ahead', () => {
    const after = llmsText(site, catalog, new Date('2026-12-01T00:00:00-03:00'))
    expect(after).toContain(`${money(3990, 'pt')} por mês ou ${money(35880, 'pt')} por ano`)
    expect(after).toContain('válidos em 01/12/2026')
    expect(after).not.toContain('passam a ser')
    expect(after).not.toContain(money(23880, 'pt'))
  })

  it('says nothing about next prices when the catalog has none', () => {
    expect(llmsText(site, { ...catalog, next: undefined }, BLACK_FRIDAY)).not.toContain(
      'passam a ser',
    )
  })

  it('says Premium Pro is coming while its sale is off, and its program once it is on', () => {
    expect(text).toContain(
      `12 meses por ${money(59880, 'pt')}, ou 12x de ${money(4990, 'pt')} sem juros, ou ${money(54990, 'pt')} no Pix à vista`,
    )
    const offSale = buildCatalog({
      ...fixture,
      plans: [fixture.plans[0], { id: 'coaching', name: 'Premium Pro', available: false }],
    })
    expect(llmsText(site, offSale, BLACK_FRIDAY)).toContain('- Premium Pro: em breve')
  })

  it('says the yearly is charged at once when the catalog gives no installments', () => {
    const once = llmsText(
      site,
      { ...catalog, premium: { ...catalog.premium, yearlyInstallments: 1 } },
      BLACK_FRIDAY,
    )
    expect(once).toContain('o anual é no cartão, de uma vez, ou no Pix à vista')
    expect(once).not.toMatch(/em até 12x(?! de)/)
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
