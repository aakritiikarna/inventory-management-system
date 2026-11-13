import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/context/*.jsx'],
    rules: {
      // Context modules intentionally export both their provider and hook.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/common/NepalBranchMap.jsx'],
    rules: {
      // The map exports its reusable Leaflet icon alongside the component.
      'react-refresh/only-export-components': 'off',
    },
  },
])
