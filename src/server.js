const express = require('express');

const app = express();

/**
 * Express configuration
 */
app.use('/index.js', express.static(__dirname + '/client/index.js'))

app.get('*', function(req, res) {

  const title = 'First title'
  const prerenderedApp = "I'm server rendered ! with static interactions !"

  const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
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