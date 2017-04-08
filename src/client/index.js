import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import App from 'app/App'
import createInitialStore from 'app/createInitialStore'

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

if (module.hot) {
  module.hot.accept('app/App', () => {
    render(require('app/App').default)
  })
}
