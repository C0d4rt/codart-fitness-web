import {
  type Catalog,
  type CoachingPlan,
  money,
  packageInstallmentCents,
  type PremiumPlan,
  pricesAt,
  yearlyInstallment,
} from './plans'
import { fullDate } from './siteDates'

type Site = { name: string; url: string; tagline: string }

const BRASILIA = 'America/Sao_Paulo'

const packagePrices = (coaching: CoachingPlan & { available: true }) =>
  coaching.packages
    .map(
      (pack) =>
        `${pack.months} meses por ${money(pack.totalCents, 'pt')}, ou ${pack.installments}x de ${money(packageInstallmentCents(pack), 'pt')} sem juros${pack.pixCents === undefined ? '' : `, ou ${money(pack.pixCents, 'pt')} no Pix à vista`}`,
    )
    .join('; ')

const yearlyTerms = (premium: PremiumPlan) => {
  const { count, cents } = yearlyInstallment(premium)
  return count > 1 ? `em até ${count}x de ${money(cents, 'pt')} sem juros` : 'de uma vez'
}

/** The prices from `next.from`, said with their date, while that date is ahead of `now`. */
const nextPrices = (catalog: Catalog, now: Date): string[] => {
  const { next } = catalog
  if (next === undefined || now.getTime() >= Date.parse(next.from)) return []
  const { premium, coaching } = pricesAt(catalog, new Date(next.from))
  const yearlyPix =
    premium.yearlyPixCents === undefined
      ? ''
      : `, ou ${money(premium.yearlyPixCents, 'pt')} no Pix à vista`
  return [
    `A partir de ${fullDate(next.from, 'pt', BRASILIA)}, à 0h de Brasília, os preços passam a ser:`,
    '',
    `- ${premium.name}: ${money(premium.monthlyCents, 'pt')} por mês ou ${money(premium.yearlyCents, 'pt')} por ano, ${yearlyTerms(premium)}${yearlyPix}.`,
    ...(coaching.available ? [`- ${coaching.name}: ${packagePrices(coaching)}.`] : []),
    '',
  ]
}

/** The site as plain text for AI assistants, rebuilt from the plans contract on every generate. */
export const llmsText = (site: Site, catalog: Catalog, now: Date): string => {
  const { premium, coaching } = pricesAt(catalog, now)
  const coachingLine = coaching.available
    ? `- ${coaching.name}: programa pago uma vez só, no cartão ou no Pix à vista, sem renovação, com 7 dias de garantia e reembolso integral, e sem teste grátis. ${packagePrices(coaching)}.`
    : `- ${coaching.name}: em breve, ainda sem venda.`
  const yearlyPayment =
    premium.yearlyPixCents === undefined
      ? `o anual é só no cartão, ${yearlyTerms(premium)}. O Pix vale só para o mensal.`
      : `o anual é no cartão, ${yearlyTerms(premium)}, ou no Pix à vista, por ${money(premium.yearlyPixCents, 'pt')}, sem renovação automática.`
  const group = (g: Catalog['groups'][number]) =>
    [
      `### ${g.name}`,
      ...g.features.map(
        (f) =>
          `- ${f.name} (${f.plan === 'premium' ? `${premium.name} e ${coaching.name}` : `só ${coaching.name}`}): ${f.howTo}`,
      ),
    ].join('\n')

  return [
    `# ${site.name}`,
    '',
    `> ${site.tagline}. A pessoa conta o que comeu ou treinou por texto, áudio ou foto numa conversa de WhatsApp, e o assistente anota e responde na hora com o total do dia e quanto falta para a meta. Não precisa instalar aplicativo.`,
    '',
    `- Calorias e nutrientes vêm da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do Open Food Facts; o gasto dos exercícios, do Compendium of Physical Activities.`,
    `- No ${premium.name}, o assistente registra, soma e informa: não prescreve dieta nem treino, e os treinos por nível são programas gerais, que a pessoa escolhe; não são montados para ela. No ${coaching.name}, a dieta e o treino são montados para a pessoa a partir da avaliação, com métodos baseados em evidência e conteúdo de referência, e se ajustam ao progresso dela; as dúvidas são respondidas pela equipe em até 24 horas. O assistente da conversa é uma inteligência artificial, não um nutricionista.`,
    '- Para maiores de 18 anos e, com número do Brasil, de 13 a 17 anos com a autorização do responsável, dada do WhatsApp dele. Os dados servem para o diário, o plano, a cobrança e o suporte, e são apagados a pedido, na própria conversa (LGPD).',
    '',
    '## Planos',
    '',
    `Preços em reais, válidos em ${fullDate(now.toISOString(), 'pt', BRASILIA)}.`,
    '',
    `- Teste grátis com tudo do ${premium.name}, sem cartão.`,
    `- ${premium.name}: ${money(premium.monthlyCents, 'pt')} por mês ou ${money(premium.yearlyCents, 'pt')} por ano. O mensal é no Pix ou no cartão, e no cartão renova sozinho até o cancelamento; ${yearlyPayment} Pagamento pela página Assinar do site (${site.url}/assinar) e cancelamento a qualquer hora, na conversa.`,
    `${coachingLine} Tudo do ${premium.name}, mais dieta e treino montados para a pessoa a partir da avaliação, check-ins, reavaliação mensal e dúvidas respondidas pela equipe em até 24 horas. Comprar o ${coaching.name} cancela a assinatura mensal no cartão, e os dias já pagos do ${premium.name} são descontados do preço.`,
    '',
    ...nextPrices(catalog, now),
    '## Recursos',
    '',
    ...catalog.groups.flatMap((g) => [group(g), '']),
    '## Páginas',
    '',
    `- [Início](${site.url}/): o que é e como funciona`,
    `- [Planos](${site.url}/planos): preços e o que cada plano inclui`,
    `- [Recursos](${site.url}/recursos): cada recurso com um exemplo de conversa`,
    `- [Créditos](${site.url}/creditos): fontes dos dados e a empresa`,
    `- [Contato](${site.url}/contato)`,
    '',
  ].join('\n')
}
