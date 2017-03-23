// server imports
const express = require('express');
const ReactDOMServer = require('react-dom/server')
const React = require('react')

// app imports
const { Provider } = require('react-redux')
const { StaticRouter } = require('react-router');
const App = require('app/App').default
const createInitialStore = require('app/createInitialStore').default

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

  // new state
  const store = createInitialStore()

  const title = 'First title'
  const context = {}
  const prerenderedApp = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  )

  // state. replace "<" with JS char to prevent script injection in the generated string.
  const prerenderedState = JSON.stringify(store.getState()).replace(/</g, '\\u003c')

  if (context.url) {
    res.writeHead(302, {
      Location : context.url
    })
    res.end()
    return
  }

  const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="assets/normalize.css" />
    <link rel="stylesheet" type="text/css" href="assets/styles.css" />
  </head>
  <body>
    <div id="root">${prerenderedApp}</div>
    <script src="assets/bundle.js" type="text/javascript"></script>
    <script>window.__PRELOADED_STATE__ = ${prerenderedState}</script>
    ${process.env.NODE_ENV !== 'development' ? '' : `<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>`}
  </body>
</html>
`

  res.send(template)
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