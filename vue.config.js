// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  lintOnSave: true,

  pwa: {
    name: 'Meditor One'
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
    // plugins: [new MonacoWebpackPlugin()]
  }
};
