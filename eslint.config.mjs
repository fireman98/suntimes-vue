import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import skipFormattingConfig from '@vue/eslint-config-prettier/skip-formatting'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import storybook from 'eslint-plugin-storybook'
import pluginVue from 'eslint-plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormattingConfig,
  ...storybook.configs['flat/recommended'],
  {
    ignores: ['!.storybook']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest'
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]
