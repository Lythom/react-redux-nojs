import React from 'react'
import {
  Route,
  Link
} from 'react-router-dom'

import Layout from "app/component/Layout"
import StaticAndDynamicDemo from 'app/component/StaticAndDynamicDemo'

export default () => (
  <Layout>
    <Route path="/" exact render={() => <h1>Home Page !</h1>}/>
    <Route path="/demo" component={StaticAndDynamicDemo}/>
  </Layout>
)
