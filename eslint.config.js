// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintConfigPrettier = require('eslint-config-prettier')
const eslintPluginPrettier = require('eslint-plugin-prettier')

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/no-children-prop': 'off',
    },
  },
  eslintConfigPrettier, // Deve vir por último para desabilitar regras conflitantes
  {
    ignores: ['dist/*'],
  },
])
