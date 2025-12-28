module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    parser: '@typescript-eslint/parser'
  },
  plugins: [],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS'
      ]
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'vue/attribute-hyphenation': ['error', 'always']
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      rules: {
        'no-unused-vars': 'off'
      }
    }
  ]
};
