const path = require('path');

module.exports = {
  resolve : {
    modules : [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      'server/generateStaticMapURL': 'app/helpers/null'
    }
  },
  entry   : [
    'client/index.js',
  ],
  output  : {
    path       : path.resolve('dist'),
    filename   : 'bundle.js',
    publicPath : '/assets/',
  },
  devtool: 'source-map',
  plugins: [],
  module  : {
    loaders : [
      { test : /\.js$/, loader : ['babel-loader'],  include: path.join(__dirname, 'src') },
    ]
  }
}