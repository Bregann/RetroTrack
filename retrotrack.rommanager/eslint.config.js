const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');

module.exports = [
  // Global ignores (migrated from .eslintignore)
  {
    ignores: [
      '.erb/**',
      'release/**',
      'node_modules/**',
      '**/*.css.d.ts',
      '**/*.sass.d.ts',
      '**/*.scss.d.ts',
    ],
  },
  // ESLint recommended JS rules
  js.configs.recommended,
  // @typescript-eslint recommended (configures parser, plugin, and rules)
  ...tsPlugin.configs['flat/recommended'],
  // react-hooks recommended
  reactHooks.configs.flat.recommended,
  // Project-specific overrides
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
