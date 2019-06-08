module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "prettier/vue",
    "plugin:prettier/recommended",
    '@vue/standard',
    "prettier/standard",
    '@vue/typescript',
    'plugin:vue-a11y/recommended',
  ],

  plugins: ['vue-a11y'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'no-template-curly-in-string': 'off',

    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],

    'vue/component-name-in-template-casing': ["error", "PascalCase", {
      "registeredComponentsOnly": false,
      "ignores": []
    }],

    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 0,
        ignores: [],
      },
    ],

    // 'vue/max-attributes-per-line': [
    //   'error',
    //   {
    //     singleline: 1,
    //     multiline: {
    //       max: 1,
    //       allowFirstLine: false,
    //     },
    //   },
    // ],

    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],

    'vue/html-closing-bracket-spacing': 'error',

    'vue/no-v-html': 'off',

    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'private-static-field',
          'protected-static-field',
          'public-static-field',

          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',

          'private-field',
          'protected-field',
          'public-field',

          'static-field',
          'instance-field',

          'field',

          'constructor',

          'private-static-method',
          'protected-static-method',
          'public-static-method',

          'private-instance-method',
          'protected-instance-method',
          'public-instance-method',

          'private-method',
          'protected-method',
          'public-method',

          'static-method',
          'instance-method',

          'method',
        ],
      },
    ],

    '@typescript-eslint/member-naming': ['error', { private: '^_' }],
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
