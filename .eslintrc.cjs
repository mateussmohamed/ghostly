module.exports = {
  env: {
    browser: true,
    es6: true,
    es2022: true
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-key': 'off',
    'react-refresh/only-export-components': 'warn'
  },
  overrides: [
    {
      files: ['**/*.cjs'],
      env: {
        node: true
      }
    }
  ]
}
