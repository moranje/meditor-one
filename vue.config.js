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
      new MonacoWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.platform': 0 // bypass process check
      })
    ]
  }
};
