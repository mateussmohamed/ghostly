/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  importOrder: ['^(react/(.*)$)|^(react$)', '<THIRD_PARTY_MODULES>', '', '^types$', '', '^[./]', '^(.css)'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports']
}
