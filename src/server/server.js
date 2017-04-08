import express from 'express'

import createAppRenderer from './createAppRenderer'
import createInitialStore from 'app/createInitialStore'
import * as interactions from 'app/reducers/interactions'

// server init
const app = express();

if (process.env.NODE_ENV === 'development') {
  // serving bundle from webpack in development
  console.log('Serving assets from webpack development middleware with hot reload.')
  attachWebpackDevMiddlware(app, require("../../webpack.config.js"))
}
// serving bundle et css from "dist" in production
// serving css from "dist" in development as well
console.log('Serving assets from ' + (__dirname + '/../../dist/'))
app.use('/assets', express.static(__dirname + '/../../dist/'))

// response handling
app.get('*', function(req, res) {
  const context = {}

  const store = createInitialStore()
  store.dispatch(interactions.actions.setServer())
  // initial actions can be dispatch here
  // eventually place the rest of the function in a Promise.then if some actions are thunks.
  const render = createAppRenderer(req.url, store, context)

  if (context.url) {
    res.writeHead(302, {
      Location : context.url
    })
    res.end()
    return
  }

  const html = render()
  res.send(html)
});

/**
 * Starting server
 */
const server = app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:%d', server.address().port);
});

/**
 * add the webpack-dev-middleware to an express app.
 * @param app
 * @param webpackConfig
 */
function attachWebpackDevMiddlware(app, webpackConfig) {
  // serving bundle using webpack in development
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require("webpack");

  const config = Object.assign({}, webpackConfig);
  config.entry.unshift('react-hot-loader/patch');
  config.entry.unshift('webpack-hot-middleware/client?reload=true');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NamedModulesPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath : config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}