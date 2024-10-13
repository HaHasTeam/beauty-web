import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginQuery from '@tanstack/eslint-plugin-query'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
export default tseslint.config(
  { ignores: ['dist', '/node_modules'] },
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended, 'plugin:@tanstack/query/recommended'],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@tanstack/query': pluginQuery,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@tanstack/query/exhaustive-deps': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
