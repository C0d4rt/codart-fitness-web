import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.taste-skill/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    // Prettier writes void elements as `<input />`; the rule follows it instead of fighting it.
    rules: { 'vue/html-self-closing': ['warn', { html: { void: 'always' } }] },
  },
)
