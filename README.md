# react-redux-nojs

## The architecture

<img src="https://cdn.rawgit.com/Lythom/talk-no-js-with-react-redux/d913a673/architecture.svg" style="width: 100%;height: auto;" />

See the related talk for mor details : https://github.com/Lythom/talk-no-js-with-react-redux

## Objectives

☑ Client side rich webapp

☑ Dynamic Server side rendering that handles user interactions

☑ Static server side rendering

☑ Bleeding edge dev experience (hot reload, import ressources as modules, ES6, JSX)

☐ ESLint

☐ Tests

☐ Build tools as a dependency

## 1. The most basic SSR

### Install NodeJS latest stable
From http://nodejs.org

### Install express
```
npm install --save-dev express
```

### Setup the project

> Setup the most basic server-side rendering

* src/server.js
* src/client/index.js
* package.json

## 2. Put in some React

> Introduce React clientside + serverside. But module import fails client side !

```
npm install --save react react-dom
```

Check the react version with
```
npm view react version
npm view react-router version
```

* App is ok with JS disabled.
* App crashes with js, because we don't build our client app yet

## 3. Webpack

> Introduce Webpack for client js bundling

### install webpack for packaging
```
npm install --save-dev webpack path
```

### install babel for transpilling
```
npm install --save-dev babel-loader babel-core babel-preset-es2015 babel-preset-react
```

* Create config/webpack.config.js
  * Take an input
  * Transpile using babel
  * Pack into a bundle
* Change server to point to the bundled js
* Add build script

```
npm run build
npm start
```

Now the client side is ok.
But can't use jsx or fancy es6 syntax server-side : node doesn't know "import" or "jsx" syntax.

Solution ? use babel server-side as well.

## 4. Server transpilling + Hot reload

> Add server transpilling (via babel-core/register), Hot Module Replacement and React Hot Loader. Discriminate dev and prod environments.
> Move server.js and cleanup

### Add server transpilling

* Add server/index.js :
```js
require('babel-core/register')({ "presets" : ["es2015", "react"] })
require('./server')
```
* remap script to "node src/server/index.js"

### Hot module replacement

In dev mode only => discriminate environment

* install cross-env to add NODE_ENV var in scripts
* install webpack-hot-middleware to server and remotely load on-the-fly recompiled modules
* install webpack-dev-middleware to trigger on-the-fly recompilation
```
npm i --save-dev cross-env webpack-dev-middleware webpack-hot-middleware
```
package.json scripts :
```json
"scripts": {
    "dev:debug": "cross-env NODE_ENV=development NODE_PATH=src/ node %NODE_DEBUG_OPTION% src/server/index.js",
    "dev": "cross-env NODE_ENV=development NODE_PATH=src/ node src/server/index.js",
    "start": "cross-env NODE_ENV=production NODE_PATH=src/ node src/server/index.js",
    "build": "webpack"
  },
```
* NODE_PATH so that NodeJS modules resolution match webpack resolution.
* dev:debug to have debugger available in webstorm

server.js :
```JavaScript
if (process.env.NODE_ENV === 'production') {
  // serving bundle from "dist" in production
  app.use('/assets', express.static(__dirname + '/../../dist/'))

} else {
  // serving bundle from webpack in development
  attachWebpackDevMiddlware(app, require("../../webpack.config.js"))
}

// ...

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
    publicPath       : config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}
```
* ajust webpack config to have a whole asset folder served as static instead of just the bundle js file
* Add source map generation

### React Hot loader

* install
```
npm i --save-dev react-hot-loader@next
```
* add babel plugin to .babelrc (or package.json here)
```json
    "presets": /* … */,
    "plugins": [
      "react-hot-loader/babel"
    ]
```
* Move away the test component and replace it by a generic App component (to cut the direct dependency from client and server index files).
* Adapt client/index.js with the AppContainer :
```js
import React from 'react'
import ReactDOM from 'react-dom'

import App from 'app/App'
import { AppContainer } from 'react-hot-loader'

const rootNode = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(<AppContainer><Component /></AppContainer>, rootNode)
}

render(App)

if (module.hot) {
  module.hot.accept('app/App', () => {
    render(require('app/App').default)
  })
}

```
* Use JSX and es6 everywhere (finally !)
* Update demo component to showcase hot reload with state preservation

## 5. Routing

> Routing with react-router 4

```
npm install --save react-router react-router-dom
```

* Use a static router on the server, see server/server.js. (https://reacttraining.com/react-router/core/api/StaticRouter)
* Use a browser history based router on the server, see client/index.js. (https://reacttraining.com/react-router/web/example/basic)
* Use Route based renderings in the app, see app/App.js

## 6. Redux

> Add basic redux to track state

```
npm install --save redux react-redux
```

* Mount a root reducer and a first reducer
    * Root reducer not required yet but the app WILL scale. 
        * Otherwise don't use redux.
    * Easier refactoring
* CreateInitialStore to build the store. Universal for the moment so same file for client and server.
* Client side : Use Provider with initialized store from server
* Server side : Generate an initial state and pass it to client

The state now persists while navigating in the app !

## 7. Styling

### CSS-in-JS discussion

« Application source code must not reference any custom CSS in JS library, everything must be a component. » - Daniel Steigerwald, este.js creator

But :
* Not (yet) a stable proven lib that expose only thoses famous components. 
  * follow https://github.com/este/este
  * read https://medium.com/@steida/css-in-js-the-argument-refined-471c7eb83955
* Not every front-end developer / design knows React
* Not that many React developers understand well a component based architecture
* CSS-in-JS add complexity in architecture implementation

### Vanilla JS

* Well known (Anyone that knows CSS can work without overhead)
* Ultra simple (include stylesheet, use class)
* Dev experience (gulp watcher + compiler + live reload is a long time standard)

But :
* Well known problems 
  * global namespace, 
  * scalability problems, 
  * no silver-bullet method (OOCSS, BEM, Atomic),
  * no Dead Code Elimination (DCE), even manually it's hard/impossible.

So ?
* No perfect solution
* I'll go with Atomic design
  * Reusable
  * Easy to read (and to adopt for incoming developpers)
  * Easy style guide (you can copy paste any atom / molecule and it will render correctly anywhere)
  * Productive (fast prototyping, easy maintenance)
  * Overridable
  * Read
    * http://bradfrost.com/blog/post/atomic-web-design/
    * https://www.haikudeck.com/atomic-css-science-and-technology-presentation-dJ0xlFjhBQ

### Finally

> Keep going with style

* Split React component to separate "styled" components and "app specific" components
* Use normalize.css
* Add style.scss
* npm scripts ftw
* Css delivery + livereload (dev only) on the server

## Static generation

This will allow server failure resilience, by serving an alternative static only version.

> Add static html files generation

```npm i -- save-dev static-site-generator-webpack-plugin http-server```

* Create a new store "interactions" that tell the app if the current rendering is :
  * static : no interactions are possible,
  * server : interactions are possible via server request,
  * dynamic : interactions are possible client-side with JavaScript.
* Renames pages as "html" for transparent transition with static rendering.
* Refactor server to extract render to string function.
* Render statics using webpack.
  * Config is in webpack.static.config.js via static-site-generator-webpack-plugin.
  * Reuse render to string in server/static.js.
* Add entries in package.json scripts to build and serve statics.
* Fix a Redux + React-Router trick in App.js.
  

## 8. Getting serious

### server side counter

> 73c2379 - Add server interactions to counter component : server basic session handling via https.

```
npm install --save shortid
npm install --save-dev cookie-parser
```

* Implement a cookie session mechanic server-side to track the data over requests.
  * Use express cookie-parser to read cookies.
  * Generate a cookie using shortid.
  * Implement an archaic in-memory session to persist data over the session.
* Use https protocol to secure the cookie id and prevent thief of credential or data,
  * with private key + self-signed cert for local tests.
* Count from the first time the server is requested during this session.
  * Use a starttime instead of an incremental counter.
  * Calculate the difference between now and the starttime to display counter.
  * The startime is created with the session initialisation and is not updated then.

### server side openstreetmap (or google-map)

* Add a map reducer to track filter and currentSelection
* Data
  * Download data from http://umap.openstreetmap.fr in server assets
  * create a withData HOC to inject static json in components
* Map components
  * MapPage for navigation and openLayer 3 dynamic fetching and injection
  * MyMap to assemble Filter / Map / List componants
  * OLMap to wrap the OpenLayer plugin and display the points on a map
  * MapList to display the filtered textual list of points
  * SelectionPopup to display a popup statically or dynamically
* Utilities functions to work with the data

