import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.taste-skill/**', 'playwright-report/**', 'test-results/**'],
})
