// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const { fixupConfigRules } = require('@eslint/compat');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // eslint-plugin-react (bundled by eslint-config-expo) still calls context
  // APIs that ESLint 10 removed; fixupConfigRules shims them back in.
  // Drop the wrapper once eslint-plugin-react supports ESLint 10.
  fixupConfigRules(expoConfig),
  {
    ignores: ['dist/*'],
  },
]);
