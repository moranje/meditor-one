module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/recommended', '@vue/standard', '@vue/typescript'],

  plugins: ['sort-class-members'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off'

    // 'sort-class-members/sort-class-members': [
    //   2,
    //   {
    //     order: [
    //       '[static-properties]',
    //       '[static-methods]',
    //       '[properties]',
    //       '[conventional-private-properties]',
    //       'constructor',
    //       '[methods]',
    //       '[conventional-private-methods]'
    //     ],
    //     accessorPairPositioning: 'getThenSet'
    //   }
    // ]
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
