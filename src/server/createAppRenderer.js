import React from 'react'
import ReactDOMServer from 'react-dom/server'

// app imports
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import App from 'app/App'

export default (url, store = undefined, context = {}) => function render() {
  const title = 'First title'
  const context = {}
  const prerenderedApp = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  )

  // state. replace "<" with JS char to prevent script injection in the generated string.
  const prerenderedState = JSON.stringify(store.getState()).replace(/</g, '\\u003c')

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="assets/normalize.css" />
    <link rel="stylesheet" type="text/css" href="assets/styles.css" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon"> 
  </head>
  <body>
    <div id="root">${prerenderedApp}</div>
    <script>window.__PRELOADED_STATE__ = ${prerenderedState}</script>
    <script src="assets/bundle.js" type="text/javascript"></script>
    ${process.env.NODE_ENV !== 'development' ? '' : `<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>`}
  </body>
</html>
`
}
