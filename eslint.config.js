import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import parserTypeScript from '@typescript-eslint/parser'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['**/*.{vue,ts,js}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: parserTypeScript,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': pluginTypeScript
    },
    rules: {
      ...pluginVue.configs['vue3-recommended'].rules,
      ...pluginTypeScript.configs.recommended.rules
    }
  }
]
