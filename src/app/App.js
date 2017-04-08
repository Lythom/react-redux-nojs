import React from 'react'
import { connect } from 'react-redux'
import {
  Route,
  withRouter,
  Redirect,
  Link
} from 'react-router-dom'

import Layout from 'app/component/Layout'
import StaticAndDynamicDemo from 'app/component/StaticAndDynamicDemo'

import * as interactions from 'app/reducers/interactions'

const App = React.createClass({
  componentDidMount() {
    this.props.setDynamic()
  },

  render() {
    return <Layout>
      <Route path="/" exact render={() => <h1>Home Page !<Redirect to="/index.html" /></h1>}/>
      <Route path="/index.html" render={() => <h1>Home Page !</h1>}/>
      <Route path="/demo.html" component={StaticAndDynamicDemo}/>
    </Layout>
  }
})

function mapDispatchToProps(dispatch) {
  return {
    setDynamic : () => dispatch(interactions.actions.setDynamic())
  }
}

export default withRouter(connect(undefined, mapDispatchToProps)(App))