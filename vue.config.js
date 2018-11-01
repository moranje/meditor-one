const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  lintOnSave: true,
  // parallel: false,

  pwa: {
    name: 'Meditor One'
  },

  configureWebpack: {
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
          '!codelens', // May use this at some point
          '!colorDetector',
          '!iPadShowKeyboard',
          '!toggleHighContrast',
          '!toggleTabFocusMode'
        ]
      }),
      new webpack.DefinePlugin({
        'process.platform': 0 // bypass process check
      })
    ]
  }
};
