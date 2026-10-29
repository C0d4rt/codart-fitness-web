import { money, type Catalog } from './plans'

type Site = { name: string; url: string; tagline: string }

/** The site as plain text for AI assistants, rebuilt from the plans contract on every generate. */
export const llmsText = (site: Site, catalog: Catalog, builtOn: string): string => {
  const plan = (p: Catalog['premium']) =>
    `- ${p.name}: ${money(p.monthlyCents, 'pt')} por mês ou ${money(p.yearlyCents, 'pt')} por ano`
  const group = (g: Catalog['groups'][number]) =>
    [
      `### ${g.name}`,
      ...g.features.map(
        (f) =>
          `- ${f.name} (${f.plan === 'basic' ? 'Básico e Premium' : 'só Premium'}): ${f.howTo}`,
      ),
    ].join('\n')

  return [
    `# ${site.name}`,
    '',
    `> ${site.tagline}. A pessoa conta o que comeu ou treinou por texto, áudio ou foto numa conversa de WhatsApp, e o diário anota e responde na hora com o total do dia e quanto falta para a meta. Não precisa instalar aplicativo.`,
    '',
    `- Calorias e nutrientes vêm da Tabela Brasileira de Composição de Alimentos (TACO, NEPA/Unicamp) e do Open Food Facts; o gasto dos exercícios, do Compendium of Physical Activities.`,
    '- O diário registra, soma e informa. Não prescreve dieta nem treino e não substitui um nutricionista.',
    '- Para maiores de 18 anos. Os dados servem só para o diário e são apagados a pedido, na própria conversa (LGPD).',
    '',
    '## Planos',
    '',
    `Preços em reais, válidos em ${builtOn}.`,
    '',
    `- Teste grátis: ${catalog.trialDays} dias com tudo do ${catalog.premium.name}, contados da primeira mensagem, sem cartão.`,
    plan(catalog.premium),
    plan(catalog.basic),
    '- Pagamento no Pix ou no cartão, pela conversa. Cancelamento a qualquer hora, pela conversa.',
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
