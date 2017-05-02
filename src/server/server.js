import express from 'express'
import favicon from 'serve-favicon'
import shortid from 'shortid'
import cookieParser from 'cookie-parser'

import fs from 'fs'
import https from 'https'
import http from 'http'

import createAppRenderer from './createAppRenderer'
import { getSession, setSession } from './session'
import createInitialStore from 'app/createInitialStore'
import * as interactions from 'app/reducers/interactions'
import * as counter from 'app/reducers/counter'

const SESSION_DURATION = 5 * 60 * 1000 // 5 minutes

// server init
const app = express();

app.use(favicon(__dirname + '/../../dist/favicon.ico'))
app.use(cookieParser())

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

  console.log('reading cookie', JSON.stringify(req.cookies))
  const sessionid = req.cookies.session || shortid.generate()

  getSession(req.cookies.session)
    // else return the session
    .then((sessionData) => {

      console.log(`Request from ${sessionid}`)

      // create store from the session data
      const store = createInitialStore(sessionData)

      // initial actions can be dispatch here
      // eventually place the rest of the function in a Promise.then if some actions are thunks.
      store.dispatch(interactions.actions.setServer())

      setSession(sessionid, store.getState())

      // render
      const context = {}
      const render = createAppRenderer(req.url, store, context)

      // redirect id asked by the app
      if (context.url) {
        res.writeHead(302, {
          Location : context.url
        })
        res.end()
        return
      }

      // return
      const html = render()
      res.cookie('session', sessionid, { maxAge: SESSION_DURATION, secure : process.env.NODE_ENV !== 'development', httpOnly : true })
      res.send(html)
    })
});

/**
 * Starting server
 */
const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../../config/server.key', 'utf8'),
  cert: fs.readFileSync(__dirname + '/../../config/server.crt', 'utf8')
}

const serverHttps = https.createServer(httpsOptions, app).listen(3443, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at https://localhost:%d', serverHttps.address().port);
});

/**
 * Allow http in dev to work with livereload
 */
if (process.env.NODE_ENV === 'development') {
  const serverHttp = http.createServer(app).listen(3000, 'localhost', function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Listening at http://localhost:%d', serverHttp.address().port);
  });
} else {
  // http redirects to https (required for session handling)
  const httpExpress = express()
  httpExpress.get('*', function(req, res) {
    res.redirect('https://localhost:3443' + req.url)
  })
  const serverHttp = http.createServer(httpExpress).listen(3000);
}

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