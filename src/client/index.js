import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import App from 'app/App'

const rootNode = document.getElementById('root')

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Router>
        <Component />
      </Router>
    </AppContainer>, rootNode)
}

render(App)

if (module.hot) {
  module.hot.accept('app/App', () => {
    render(require('app/App').default)
  })
}
