/*
 ./webpack.config.js
 */
const path = require('path');
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  entry: 'client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ]
  }
}