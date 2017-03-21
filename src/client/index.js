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
