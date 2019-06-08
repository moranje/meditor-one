const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        vs: path.join(__dirname, 'node_modules/monaco-editor-core/esm/vs'),
      },
    },

    plugins: [
      new MonacoWebpackPlugin({
        // Exclude ALL built-in languages
        languages: [],
        features: [
          // Exclude unused features
          '!accessibilityHelp',
          '!colorDetector',
          '!iPadShowKeyboard',
          '!toggleHighContrast',
          '!toggleTabFocusMode',
          '!snippets', // uses custom snippets
        ],
      }),
      // new webpack.DefinePlugin({
      //   'process.platform': 0 // bypass process check
      // })
    ],
  },

  chainWebpack: config => {
    // Markdown as string loader
    config.module.rule('raw-loader').test(/\.md$/i)
    // .use('raw-loader')
    // .loader('raw-laoder')
    // .end()
  },
}
