// const webpack = require('webpack');
// const MonacoWebpackPlugin = require('./build/monaco-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  lintOnSave: true,

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
    // plugins: [
    //   new CopyWebpackPlugin([
    //     {
    //       from: 'node_modules/monaco-editor/min/vs',
    //       to: 'vs'
    //     }
    //   ])
    // new MonacoWebpackPlugin(webpack)
    // ]
  }
};
