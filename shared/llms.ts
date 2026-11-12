import { installmentCents, money, type Catalog } from './plans'

type Site = { name: string; url: string; tagline: string }

/** The site as plain text for AI assistants, rebuilt from the plans contract on every generate. */
export const llmsText = (site: Site, catalog: Catalog, builtOn: string): string => {
  const { premium, coaching } = catalog
  const coachingLine = coaching.available
    ? `- ${coaching.name}: programa pago uma vez só, sem renovação, com 7 dias de garantia e sem teste grátis. ${coaching.packages
        .map(
          (pack) =>
            `${pack.months} meses por ${money(pack.totalCents, 'pt')} (${pack.installments}x de ${money(installmentCents(pack), 'pt')})`,
        )
        .join('; ')}.`
    : `- ${coaching.name}: em breve, ainda sem venda.`
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
    `> ${site.tagline}. A pessoa conta o que comeu ou treinou por texto, áudio ou foto numa conversa de WhatsApp, e o diário anota e responde na hora com o total do dia e quanto falta para a meta. Não precisa instalar aplicativo.`,
    '',
    `- Calorias e nutrientes vêm da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do Open Food Facts; o gasto dos exercícios, do Compendium of Physical Activities.`,
    `- No ${premium.name}, o diário registra, soma e informa: não prescreve dieta nem treino, e os treinos prontos são programas gerais, assinados por educador físico (CREF), que a pessoa escolhe. No ${coaching.name}, a dieta e o treino são montados para a pessoa, sob a responsabilidade de nutricionista (CRN) e educador físico (CREF). O assistente da conversa não é nutricionista.`,
    '- Para maiores de 18 anos. Os dados servem só para o diário e são apagados a pedido, na própria conversa (LGPD).',
    '',
    '## Planos',
    '',
    `Preços em reais, válidos em ${builtOn}.`,
    '',
    `- Teste grátis: ${catalog.trialDays} dias com tudo do ${premium.name}, contados da primeira mensagem, sem cartão.`,
    `- ${premium.name}: ${money(premium.monthlyCents, 'pt')} por mês ou ${money(premium.yearlyCents, 'pt')} por ano. Pagamento no Pix ou no cartão, pela conversa, e cancelamento a qualquer hora.`,
    `${coachingLine} Tudo do ${premium.name}, mais dieta e treino montados para a pessoa, sob a responsabilidade de nutricionista e educador físico.`,
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
