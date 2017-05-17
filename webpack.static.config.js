const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

module.exports = {
  resolve : {
    modules : [path.resolve(__dirname, "src"), "node_modules"]
  },
  entry   : {
    'static' : 'server/static.js',
    'bundle' : 'client/index.js',
  },
  output  : {
    path          : path.resolve('dist-static'),
    filename      : 'assets/[name].js',
    publicPath    : '/assets/',
    libraryTarget : 'umd',
  },
  devtool : 'source-map',
  plugins : [
    new StaticSiteGeneratorPlugin({
      entry : 'static',
      paths: [
        '/index.html',
        '/demo.html',
        '/map.html',
      ],
    })
  ],
  module  : {
    loaders : [
      { test : /\.js$/, loader : ['babel-loader'], include : path.join(__dirname, 'src') },
      { test : /\.umap$/, loader : ['json-loader'], include : path.join(__dirname, 'src') },
    ]
  }
}