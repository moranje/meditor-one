const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
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
          '!toggleTabFocusMode'
        ]
      })
      // new webpack.DefinePlugin({
      //   'process.platform': 0 // bypass process check
      // })
    ]
  }
}
