module.exports = {
  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-indent': ['error', 2],
    'vue/html-quotes': ['error', 'double'],
    'vue/html-closing-bracket-newline': 'warning',
    'vue/html-closing-bracket-spacing': 'warning',
    'vue/no-use-v-if-with-v-for': 'warning',
    'vue/no-v-html': 'warning',
    'vue/prop-name-casing': 'warning',
    'vue/script-indent': 'warning'
  },

  parserOptions: {
    parser: 'typescript-eslint-parser'
  },

  extends: ['plugin:vue/recommended', '@vue/prettier', '@vue/typescript'],

  'extends': [
    'plugin:vue/recommended',
    '@vue/prettier',
    '@vue/typescript'
  ]
};
