import React from 'react'
import {
  Route,
  Link
} from 'react-router-dom'

import StaticAndDynamicDemo from 'app/component/StaticAndDynamicDemo'

export default () => (
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/demo">Demo counter</Link></li>
      </ul>

      <hr />

      <Route path="/" exact render={() => <h1>Home Page !</h1>} />
      <Route path="/demo" component={StaticAndDynamicDemo} />
    </div>
)
