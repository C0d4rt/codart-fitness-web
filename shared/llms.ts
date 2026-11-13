import { installmentCents, money, type Catalog } from './plans'

type Site = { name: string; url: string; tagline: string }

/** The site as plain text for AI assistants, rebuilt from the plans contract on every generate. */
export const llmsText = (site: Site, catalog: Catalog, builtOn: string): string => {
  const { premium, coaching } = catalog
  const coachingLine = coaching.available
    ? `- ${coaching.name}: programa pago uma vez só, no cartão, sem renovação, com 7 dias de garantia e reembolso integral, e sem teste grátis. ${coaching.packages
        .map(
          (pack) =>
            `${pack.months} meses por ${money(pack.totalCents, 'pt')}, ou ${pack.installments}x de ${money(installmentCents(pack), 'pt')} sem juros`,
        )
        .join('; ')}.`
    : `- ${coaching.name}: em breve, ainda sem venda.`
  const yearlyInstallments = premium.yearlyInstallments ?? 1
  const yearlyTerms =
    yearlyInstallments > 1
      ? `em até ${yearlyInstallments}x de ${money(installmentCents({ totalCents: premium.yearlyCents, installments: yearlyInstallments }), 'pt')} sem juros`
      : 'em até 12x sem juros'
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
    `- No ${premium.name}, o assistente registra, soma e informa: não prescreve dieta nem treino, e os treinos prontos são programas gerais, que a pessoa escolhe; não são montados para ela. No ${coaching.name}, a dieta e o treino são montados para a pessoa a partir da avaliação, com métodos baseados em evidência e conteúdo de referência, e se ajustam ao progresso dela; as dúvidas são respondidas pela equipe em até 24 horas. O assistente da conversa é uma inteligência artificial, não um nutricionista.`,
    '- Para maiores de 18 anos. Os dados servem só para o assistente responder sobre a pessoa e são apagados a pedido, na própria conversa (LGPD).',
    '',
    '## Planos',
    '',
    `Preços em reais, válidos em ${builtOn}.`,
    '',
    `- Teste grátis: ${catalog.trialDays} dias com tudo do ${premium.name}, contados da primeira mensagem, sem cartão.`,
    `- ${premium.name}: ${money(premium.monthlyCents, 'pt')} por mês ou ${money(premium.yearlyCents, 'pt')} por ano. O mensal é no Pix ou no cartão, e no cartão renova sozinho até o cancelamento; o anual é só no cartão, ${yearlyTerms}. O Pix vale só para o mensal. Pagamento pela conversa e cancelamento a qualquer hora.`,
    `${coachingLine} Tudo do ${premium.name}, mais dieta e treino montados para a pessoa a partir da avaliação, check-ins, reavaliação mensal e dúvidas respondidas pela equipe em até 24 horas. Comprar o ${coaching.name} cancela a assinatura mensal no cartão, e os dias já pagos do ${premium.name} são descontados do preço.`,
    '',
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
