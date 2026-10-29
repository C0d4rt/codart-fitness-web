import { icuCompiler } from '#shared/messageFormat'
import enUS from './locales/en-US.json'
import ptBR from './locales/pt-BR.json'

export default defineI18nConfig(() => ({
  messageCompiler: icuCompiler,
  messages: { pt: ptBR, en: enUS },
}))
