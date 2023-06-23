/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-console': 'off',
    'space-before-function-paren': 'off',
    'arrow-parens': 'off',
    'import/no-named-as-default': 'off',
    'no-trailing-spaces': 0,
    indent: 0,
    'no-return-assign': 0,
    'comma-dangle': 0,
    'no-unused-vars': 'off',
    'eol-last': 'never',
    "no-multiple-empty-lines": ["error", { "max": 2 }]
  }
}
