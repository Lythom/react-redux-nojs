import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import App from 'app/App'
import createInitialStore from 'app/createInitialStore'
import * as interactions from 'app/reducers/interactions'

const rootNode = document.getElementById('root')

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__
// create the store
const store = createInitialStore(preloadedState)
// browser history
const history = createBrowserHistory()

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          <Component />
        </Router>
      </Provider>
    </AppContainer>, rootNode)
}

render(App)

window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
  if (errorMsg.indexOf('Uncaught Error') > -1) {
    try {
      store.dispatch(interactions.actions.set(preloadedState.interactions))
    } catch(e) {
      console.error('Could not revert app to server interactions state', e)
    }
    try {
      const html = rootNode.innerHTML
      ReactDOM.unmountComponentAtNode(rootNode)
      rootNode.innerHTML = html
    } catch(e) {
      console.error('Could not unmount React', e)
    }
  }
}

if (module.hot) {
  module.hot.accept('app/App', () => {
    render(require('app/App').default)
  })
}
