/** The one place the provisional brand lives: moving to the own domain is changing this file. */
const name = 'Fitness'

export const brand = {
  name,
  siteUrl: 'https://fitness.codart.dev',
  tagline: 'Seu diário de dieta e treino no WhatsApp',
  greeting: (trialDays?: number) =>
    trialDays
      ? `Oi! Quero testar o ${name} ${trialDays} dias grátis`
      : `Oi! Quero testar o ${name}`,
  company: {
    name: 'Codart Tecnologia LTDA',
    cnpj: '65.840.318/0001-26',
    city: 'São Paulo, SP',
    email: 'contato@codart.dev',
  },
} as const
