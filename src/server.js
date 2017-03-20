// server imports
const express = require('express');
const ReactDOMServer = require('react-dom/server')
const React = require('react')

// app imports
const StaticAndDynamicDemo = require('./app/component/StaticAndDynamicDemo')

// server init
const app = express();

/**
 * Express configuration
 */
app.use('/index.js', express.static(__dirname + '/client/index.js'))

app.get('*', function(req, res) {

  const title = 'First title'
  const prerenderedApp = ReactDOMServer.renderToString(React.createElement(StaticAndDynamicDemo))

  const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js" />
  </head>
  <body>
    <div id="root">${prerenderedApp}</div> 
    <script src="index.js"></script>
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